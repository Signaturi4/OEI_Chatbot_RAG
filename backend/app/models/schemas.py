from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# Chat Models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    message: str
    courses: Optional[List[Dict[str, Any]]] = None

# Course Models
class Teacher(BaseModel):
    id: int
    first_name: str
    last_name: str
    full_name: str
    email: str
    city: str
    country: str

class CourseWeekday(BaseModel):
    start_time: str
    finish_time: str
    week_day: str

class Course(BaseModel):
    id: int
    title: str
    description: str
    level: str
    status: str
    format: str
    target_group: str
    location_city: str
    price: str
    currency: str
    web_url: str
    checkout_url: Optional[str] = None
    start_at: str
    finish_at: str
    free_places_count: int
    max_participants: int
    teachers: Optional[List[Teacher]] = None
    course_weekdays: Optional[List[CourseWeekday]] = None

class Location(BaseModel):
    id: int
    title: str
    location: str
    country: Dict[str, Any]

class CourseSearchRequest(BaseModel):
    query: str
    location_id: Optional[int] = None
    max_pages: Optional[int] = 1

class CourseDetailRequest(BaseModel):
    course_id: int
    location_id: Optional[int] = None

class PlacementTestRequest(BaseModel):
    location_id: Optional[int] = None

# API Response Models
class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
