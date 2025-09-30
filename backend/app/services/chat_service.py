import os
import sys
import json
import re
from pathlib import Path
from typing import List, Dict, Any

# Add parent directory to path for oei_live imports
parent_dir = Path(__file__).parent.parent.parent.parent
sys.path.append(str(parent_dir))

# LangChain Imports
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.tools import tool

# Supabase Imports
from supabase.client import Client, create_client

# Standard Library Imports
import logging

logger = logging.getLogger(__name__)

# Hardcoded currency mapping based on Supabase analysis
LOCATION_CURRENCY_MAPPING = {
    "Bosnia and Herzegovina": "КМ",
    "Czechia": "Kč", 
    "Hungary": "Ft",
    "Italy": "€",
    "Poland": "zł",
    "Serbia": "RSD",
    "Slovakia": "€",
}

class ChatService:
    def __init__(self):
        """Initializes the ChatService and its components."""
        self.agent_executor = None
        self.vector_store = None
        self._initialize_services()
    
    def _initialize_services(self):
        """Initializes the LLM, vector store, tools, and the agent executor once."""
        try:
            # --- Service Initialization ---
            openai_api_key = os.getenv("OPENAI_API_KEY")
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
            
            if not all([openai_api_key, supabase_url, supabase_key]):
                logger.error("Missing required environment variables for OpenAI or Supabase.")
                return

            llm = ChatOpenAI(model="gpt-4o", temperature=0.1) # Slightly increased temp for more natural conversation
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            supabase_client = create_client(supabase_url, supabase_key)
            self.vector_store = SupabaseVectorStore(
                client=supabase_client,
                embedding=embeddings,
                table_name="documents",
                query_name="match_documents",
            )

            # --- REVISED System Prompt Definition ---
            # This prompt is much simpler. It tells the agent its only job is to have a conversation.
            prompt_template = ChatPromptTemplate.from_messages([
                ("system",
                    "You are a friendly and helpful AI course advisor for the Österreich Institut. Ask questions that follow along with the conversation flow, talk in the user language, mirror the user, if querry is not clear. The user messages stylistic, is the tone-of-voice you should apply too"
                    "Usercase1: (finding the best fiting course): Ask questions, to find out the correct 1:(location + offline/online) 2: (when has the user started learning german); 3: (at what date should the course start and what time of day). Assist the user in finding the best course for their need Once you have sufficent information perform, retrival search. You will be given a JSON list of courses retrieved from a database that are relevant to the user's query. "
                    "Usercase2: (general information): Your ONLY goal provide the relevant information, always use retrival"
                    "Naturally mention one or more of the courses from the list, referecing why this course is relevant to the user's query."
                    "Your output MUST be a natural language text message. Never lie or make up information, if you are unsure about the information, say provide contact details or relevant webpages instead."
                
                ),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ])

            # --- Tool and Agent Creation ---
            tools = self._create_tools()
            agent = create_tool_calling_agent(llm, tools, prompt_template)
            # We enable return_intermediate_steps to capture the tool's raw output.
            self.agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)
            
            logger.info("Chat service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize chat service: {e}", exc_info=True)
            raise
    
    def _create_tools(self) -> List:
        """Creates the tools the agent can use."""
        @tool
        def retrieve_course_information(query: str) -> str:
            """
            Retrieves detailed course information from the database based on a user query.
            This tool must be used to answer any question about courses.
            Returns a JSON string with both content for AI and structured data for carousel.
            """
            logger.info(f"Retrieving courses for query: {query}")
            retrieved_docs = self.vector_store.similarity_search(query, k=5)
                
            # Separate content for AI and structured data for carousel
            ai_content_parts = []
            courses_details = []
            
            for doc in retrieved_docs:
                metadata = getattr(doc, 'metadata', {})
                
                # Extract content for AI from any document (both live and static)
                # Try different possible content field names
                content = (metadata.get('content', '') or 
                          getattr(doc, 'page_content', '') or 
                          getattr(doc, 'content', ''))
                
                if content:
                    ai_content_parts.append(content)
                
                # Only process course data for live courses
                if metadata.get('source_type') == 'live':
                    # Extract structured data for carousel
                    course_data = {
                        'course_id': metadata.get('course_id'),
                        'title': metadata.get('title'),
                        'level': metadata.get('level'),
                        'price': metadata.get('price'),
                        'currency_symbol': self._get_currency_symbol(metadata),
                        'format': metadata.get('format'),
                        'target_group': metadata.get('target_group'),
                        'start_date': metadata.get('start_date'),
                        'end_date': metadata.get('end_date'),
                        'location_city': metadata.get('location_city'),
                        'free_places': metadata.get('free_places'),
                        'max_participants': metadata.get('max_participants'),
                        'min_participants': metadata.get('min_participants'),
                        'location_id': metadata.get('location_id'),
                        'category': metadata.get('category'),
                        'course_type': metadata.get('course_type'),
                        'frequency': metadata.get('frequency'),
                        'lesson_count': metadata.get('lesson_count'),
                        'lesson_duration': metadata.get('lesson_duration'),
                        'books_included': metadata.get('books_included'),
                        'exam_fees': metadata.get('exam_fees'),
                        'status_text': metadata.get('status_text'),
                        'country_code': metadata.get('country_code'),
                        'country_name': metadata.get('country_name'),
                        'teachers': metadata.get('teachers', []),
                        'course_weekdays': metadata.get('weekdays', []),
                        'description': self._extract_description_from_content(content),
                    }
                    
                    # Generate URLs
                    if course_data['course_id'] and course_data['location_id']:
                        course_data['web_url'] = f"https://servuswebshop.oesterreichinstitut.com/en/courses/{course_data['location_id']}/{course_data['course_id']}"
                        course_data['checkout_url'] = f"https://servuswebshop.oesterreichinstitut.com/en/checkout/{course_data['location_id']}/{course_data['course_id']}"
                    
                    courses_details.append(course_data)
            
            # Return both AI content and structured data
            result = {
                'ai_content': '\n\n'.join(ai_content_parts),
                'courses_data': courses_details
            }
            
            return json.dumps(result, ensure_ascii=False)
        
        return [retrieve_course_information]

    def _get_currency_symbol(self, metadata: dict) -> str:
        """Get currency symbol using hardcoded mapping based on country name"""
        country_name = metadata.get('country_name')
        
        if country_name and country_name in LOCATION_CURRENCY_MAPPING:
            return LOCATION_CURRENCY_MAPPING[country_name]
        
        # Fallback to database values if country not found in mapping
        return (metadata.get('course_currency_symbol') or 
                metadata.get('currency_symbol') or 
                metadata.get('currency', '€'))

    def _extract_description_from_content(self, content: str) -> str:
        """Extract description from content field that starts with 'Description:'"""
        if not content:
            return "Course description will be available soon. This course is designed to provide comprehensive language learning experience."
        
        # Look for "Description:" in the content
        if "Description:" in content:
            # Split by "Description:" and take the part after it
            parts = content.split("Description:", 1)
            if len(parts) > 1:
                description = parts[1].strip()
                # Clean up the description (remove extra whitespace, newlines)
                description = " ".join(description.split())
                return description
        
        # Fallback to the full content if no "Description:" found
        return content.strip() if content.strip() else "Course description will be available soon. This course is designed to provide comprehensive language learning experience."

    async def get_response(self, message: str, chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Gets a response from the AI agent using the correct and efficient RAG workflow.
        """
        if not self.agent_executor:
            raise Exception("Chat service is not properly initialized.")

        try:
            history_messages = [
                HumanMessage(content=msg["content"]) if msg["role"] == "user" 
                else AIMessage(content=msg["content"]) 
                for msg in chat_history
            ]

            # STEP 1: Invoke the agent. It will decide to call the tool on its own.
            result = self.agent_executor.invoke({
                "input": message,
                "chat_history": history_messages,
            })
            
            # STEP 2: Extract the structured data and AI content from the tool's output.
            all_retrieved_courses = []
            ai_content = ""
            if "intermediate_steps" in result and result["intermediate_steps"]:
                # The 'observation' is the direct JSON string output from our tool
                tool_output_json = result["intermediate_steps"][0][1]
                try:
                    tool_data = json.loads(tool_output_json)
                    all_retrieved_courses = tool_data.get("courses_data", [])
                    ai_content = tool_data.get("ai_content", "")
                except json.JSONDecodeError:
                    logger.warning("Could not parse tool output as JSON.")

            # STEP 3: Get the final conversational message from the LLM.
            llm_text_response = result.get("output", "")

            # STEP 4: Return both the conversation and the full structured data.
            return {
                "message": llm_text_response,
                "courses": all_retrieved_courses,  # This contains ALL retrieved courses
                "ai_content": ai_content  # Raw content used for AI processing
            }
            
        except Exception as e:
            logger.error(f"Error getting response: {e}", exc_info=True)
            raise Exception(f"Failed to get response: {e}")
    
    async def health_check(self) -> bool:
        """Check if the service is healthy."""
        try:
            return (
                self.agent_executor is not None and
                self.vector_store is not None
            )
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return False