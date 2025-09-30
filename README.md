# OEI Chatbot - Agentic RAG with LangChain

A modern chatbot application for the Österreich Institut that provides intelligent course recommendations using Retrieval Augmented Generation (RAG) with LangChain.

## 🚀 Features

- **Intelligent Course Recommendations**: AI-powered course suggestions based on user queries
- **Real-time Chat Interface**: Modern React-based chat interface with responsive design
- **Course Carousel**: Interactive course cards with detailed information
- **Multi-language Support**: Supports multiple languages and locations
- **Vector Search**: Powered by Supabase vector store for semantic search
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with async support
- **AI/ML**: LangChain with OpenAI GPT-4o
- **Vector Store**: Supabase with OpenAI embeddings
- **Database**: Supabase PostgreSQL
- **Deployment**: Railway

### Frontend (React/TypeScript)
- **Framework**: React 19 with TypeScript
- **Styling**: Styled Components
- **UI Components**: Custom components with Apple-inspired design
- **State Management**: React hooks
- **Deployment**: Vercel

## 📁 Project Structure

```
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── core/           # Configuration
│   ├── main.py             # FastAPI application entry point
│   └── requirements.txt    # Python dependencies
├── oei-chatbot-react/      # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # Styling and themes
│   │   └── types/          # TypeScript types
│   └── package.json        # Node.js dependencies
├── railway.json            # Railway deployment config
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account
- OpenAI API key

### Environment Variables

#### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_url
```

### Local Development

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn main:app --reload
   ```

2. **Frontend Setup**:
   ```bash
   cd oei-chatbot-react
   npm install
   npm start
   ```

## 🌐 Deployment

### Backend - Railway

1. **Connect Repository**:
   - Go to [Railway](https://railway.com/)
   - Click "Deploy from GitHub Repo"
   - Select your repository

2. **Configure Environment Variables**:
   - Add the required environment variables in Railway dashboard
   - Railway will automatically detect the Python backend

3. **Deploy**:
   - Railway will automatically build and deploy your backend
   - Your API will be available at the provided Railway URL

### Frontend - Vercel

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: Create React App
   - Root Directory: `oei-chatbot-react`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables**:
   - Add `REACT_APP_API_URL` with your Railway backend URL

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## 🔧 Configuration

### Railway Configuration
The `railway.json` file configures:
- Build process using Nixpacks
- Health check endpoint
- Restart policies
- Port configuration

### Vercel Configuration
The `vercel.json` file configures:
- Build settings for React app
- Routing configuration
- Static file serving

## 📊 API Endpoints

### Backend API
- `POST /chat/message` - Send chat message and get AI response
- `GET /health` - Health check endpoint

### Request Format
```json
{
  "message": "I'm looking for A1 German courses in Vienna",
  "chat_history": []
}
```

### Response Format
```json
{
  "message": "I found several A1 courses in Vienna...",
  "courses": [
    {
      "course_id": 1234,
      "title": "German A1 Course",
      "level": "A1",
      "price": "€450",
      "location_city": "Vienna",
      "start_date": "2025-01-15",
      "checkout_url": "https://...",
      // ... other course details
    }
  ],
  "ai_content": "Raw content used for AI processing"
}
```

## 🎨 UI Components

### Course Carousel
- Responsive carousel with course cards
- Expandable course details
- Direct booking links
- Currency-aware pricing

### Chat Interface
- Real-time messaging
- Loading animations
- Error handling
- Mobile-responsive design

## 🔍 Search & Retrieval

The system uses semantic search to find relevant courses:
1. User query is embedded using OpenAI embeddings
2. Vector similarity search in Supabase
3. Retrieved documents are processed by GPT-4o
4. Structured course data is returned for UI display

## 🛠️ Development

### Adding New Features
1. Backend: Add new endpoints in `app/api/`
2. Frontend: Create components in `src/components/`
3. Types: Update TypeScript interfaces in `src/types/`

### Testing
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd oei-chatbot-react
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

Built with ❤️ using FastAPI, React, LangChain, and Supabase

