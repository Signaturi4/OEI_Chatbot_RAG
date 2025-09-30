# OEI Chatbot React Frontend

Modern React + TypeScript frontend for the Österreich Institut AI Chatbot.

## Features

- 🎨 **OEI Brand Design** - Matches the official Österreich Institut website
- 💬 **Real-time Chat** - Interactive chatbot interface
- 🔍 **Course Search** - Live course search and booking
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast Performance** - Optimized React components
- 🎯 **TypeScript** - Full type safety

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── chat/          # Chat components
│   ├── course/        # Course-related components
│   ├── ui/            # Reusable UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── services/          # API services
├── styles/            # Theme and global styles
└── types/             # TypeScript type definitions
```

## Components

### Chat Components

- `ChatContainer` - Main chat interface
- `ChatMessage` - Individual message display
- `ChatInput` - Message input with send button

### UI Components

- `Button` - OEI-styled buttons
- `Card` - Content cards
- `FormattedText` - Markdown text rendering

### Course Components

- `CourseCTA` - Course booking buttons

### Layout Components

- `Header` - Site header with navigation
- `Footer` - Site footer with contact info

## Styling

The app uses styled-components with a comprehensive theme system:

- **Colors**: OEI brand colors (#B91317, #4A4A4A, #6F767E)
- **Typography**: SF UI Display font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable styled components

## API Integration

The frontend communicates with the FastAPI backend through:

- `ApiService` - HTTP client for API calls
- `useChat` - Custom hook for chat functionality
- Real-time message handling
- Error handling and retry logic

## Development

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```
