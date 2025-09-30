# OEI Chatbot Backend

FastAPI backend for the Österreich Institut AI Chatbot.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
DEBUG=False
```

3. Run the server:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /chat/message` - Send message to chatbot
- `POST /courses/search` - Search courses
- `GET /courses/{course_id}` - Get course details
- `GET /courses/locations` - Get available locations
- `GET /courses/placement-tests` - Get placement tests

## Documentation

API documentation is available at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
