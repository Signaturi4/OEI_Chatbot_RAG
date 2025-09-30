from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, ApiResponse
from app.services.chat_service import ChatService
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize chat service
chat_service = ChatService()

@router.post("/message", response_model=ApiResponse)
async def send_message(request: ChatRequest):
    """
    Send a message to the AI chatbot and get a response.
    """
    try:
        if not settings.openai_api_key:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not configured"
            )
        
        # Convert chat history to the format expected by the service
        chat_history = [
            {"role": msg.role, "content": msg.content, "timestamp": msg.timestamp}
            for msg in request.chat_history
        ]
        
        # Get response from chat service
        response = await chat_service.get_response(
            message=request.message,
            chat_history=chat_history
        )
        
        return ApiResponse(
            success=True,
            data=response
        )
        
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        return ApiResponse(
            success=False,
            error=f"Failed to process message: {str(e)}"
        )

@router.get("/health")
async def chat_health():
    """
    Check if the chat service is healthy.
    """
    try:
        # Test if the service can initialize
        is_healthy = await chat_service.health_check()
        return ApiResponse(
            success=is_healthy,
            data={"status": "healthy" if is_healthy else "unhealthy"}
        )
    except Exception as e:
        logger.error(f"Chat health check failed: {str(e)}")
        return ApiResponse(
            success=False,
            error=f"Health check failed: {str(e)}"
        )
