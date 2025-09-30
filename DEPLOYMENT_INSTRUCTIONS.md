# Deployment Instructions

This guide will help you deploy the OEI Chatbot to Railway (backend) and Vercel (frontend).

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to host your code
2. **Railway Account**: Sign up at [railway.com](https://railway.com/)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com/)
4. **Supabase Account**: For the database and vector store
5. **OpenAI API Key**: For the AI functionality

## Step 1: Prepare Your Code

### 1.1 Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `oei-chatbot` or `agentic-rag-chatbot`
3. Make it public or private (your choice)
4. Don't initialize with README (we already have one)

### 1.2 Upload Your Code

Since Git isn't installed locally, you can:

**Option A: Use GitHub Desktop**

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Clone your new repository
3. Copy all project files into the cloned folder
4. Commit and push

**Option B: Use GitHub Web Interface**

1. Go to your repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your project files
4. Commit the changes

**Option C: Install Git**

1. Download Git from [git-scm.com](https://git-scm.com/)
2. Install Git
3. Use the terminal commands below

```bash
git init
git add .
git commit -m "Initial commit: OEI Chatbot with RAG"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Connect to Railway

1. Go to [Railway](https://railway.com/)
2. Sign in with your GitHub account
3. Click "Deploy from GitHub Repo"
4. Select your repository
5. Railway will automatically detect it's a Python project

### 2.2 Configure Environment Variables

In the Railway dashboard, go to your project and add these environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```

### 2.3 Deploy

1. Railway will automatically start building and deploying
2. Wait for the deployment to complete
3. Note the generated URL (e.g., `https://your-app-name.railway.app`)

### 2.4 Test Backend

Visit `https://your-app-name.railway.app/health` to verify the backend is running.

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### 3.2 Configure Build Settings

In the Vercel project settings:

- **Framework Preset**: Create React App
- **Root Directory**: `oei-chatbot-react`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3.3 Add Environment Variables

Add this environment variable:

```
REACT_APP_API_URL=https://your-app-name.railway.app
```

Replace with your actual Railway backend URL.

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like `https://your-app-name.vercel.app`

## Step 4: Configure Supabase

### 4.1 Set Up Vector Store

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to SQL Editor and run the vector store setup:

```sql
-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(1536)
);

-- Create the vector similarity search function
CREATE OR REPLACE FUNCTION match_documents (
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 5,
    filter JSONB DEFAULT '{}'
) RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE metadata @> filter
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

### 4.2 Add Sample Data

You can add sample course data to test the system:

```sql
INSERT INTO documents (content, metadata, embedding) VALUES
('Course: German A1 Beginner Course\nLevel: A1\nPrice: €450\nLocation: Vienna\nStart Date: 2025-01-15',
 '{"course_id": 1001, "level": "A1", "price": "450", "location_city": "Vienna", "source_type": "live"}',
 '[0.1, 0.2, 0.3, ...]' -- Replace with actual embedding vector
);
```

## Step 5: Test Your Deployment

### 5.1 Test Backend

```bash
curl -X POST https://your-app-name.railway.app/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "chat_history": []}'
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Try sending a message like "I'm looking for A1 German courses"
3. Verify the chat interface works
4. Check if course carousel appears

## Step 6: Custom Domain (Optional)

### 6.1 Railway Custom Domain

1. In Railway dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 6.2 Vercel Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check environment variables in Railway
2. **Frontend build fails**: Check Node.js version and dependencies
3. **API connection fails**: Verify `REACT_APP_API_URL` in Vercel
4. **Vector search not working**: Check Supabase setup and embeddings

### Logs

- **Railway**: Check deployment logs in Railway dashboard
- **Vercel**: Check build logs in Vercel dashboard
- **Supabase**: Check logs in Supabase dashboard

### Support

- Railway: [Railway Discord](https://discord.gg/railway)
- Vercel: [Vercel Discord](https://vercel.com/discord)
- Supabase: [Supabase Discord](https://discord.supabase.com)

## Environment Variables Summary

### Backend (Railway)

```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...
```

### Frontend (Vercel)

```
REACT_APP_API_URL=https://your-app-name.railway.app
```

## Final URLs

After deployment, you'll have:

- **Backend API**: `https://your-app-name.railway.app`
- **Frontend App**: `https://your-app-name.vercel.app`
- **Health Check**: `https://your-app-name.railway.app/health`

## Next Steps

1. Test all functionality
2. Add more course data to Supabase
3. Customize the UI/UX
4. Set up monitoring and analytics
5. Configure CI/CD for automatic deployments

---

🎉 **Congratulations!** Your OEI Chatbot is now live on the internet!

