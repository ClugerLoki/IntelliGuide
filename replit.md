# IntelliGuide - AI Recommendation System

## Overview

IntelliGuide is a full-stack web application that provides personalized AI-powered recommendations across multiple categories including fashion, health, travel, books, movies, and music. The application uses a conversational approach where an AI assistant asks questions to understand user preferences before providing tailored recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Speech Features**: Web Speech API integration for voice input/output

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON communication
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite integration

## Key Components

### AI Integration
- **Service**: Google Gemini AI for generating conversational responses
- **Approach**: Context-aware conversations that build user profiles through questions
- **Categories**: Specialized prompts for each recommendation category
- **Response Processing**: Structured handling of AI responses and recommendation extraction

### Data Models
- **Users**: Basic user information with authentication provider support
- **Chat Sessions**: Conversation history with category-specific context
- **Messages**: Individual conversation messages with timestamps and metadata
- **Categories**: Predefined recommendation categories with specialized AI prompts

### Storage Strategy
- **Primary**: Firebase Firestore for cloud-based data persistence
- **Fallback**: In-memory storage when Firebase is unavailable
- **Session Management**: Chat sessions and message history stored persistently
- **User Management**: Support for authenticated users and guest sessions
- **Guest Support**: Full functionality without requiring user accounts

### UI/UX Design
- **Design System**: Custom theme with primary/secondary color scheme
- **Responsive**: Mobile-first design with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Voice Interface**: Optional speech-to-text and text-to-speech capabilities

## Data Flow

1. **Welcome Flow**: User authentication or guest access
2. **Category Selection**: User chooses recommendation category
3. **Conversation**: AI asks targeted questions to understand preferences
4. **Recommendation Generation**: AI provides personalized suggestions
5. **Recommendation Display**: Structured presentation of recommendations
6. **Session Persistence**: Conversation history maintained for context

### API Endpoints
- `POST /api/chat` - Main conversation endpoint handling message exchange
- Session management through chat session IDs
- Guest user support with optional user association

## External Dependencies

### Core Technologies
- **Google Gemini AI**: Natural language processing and recommendation generation
- **Neon Database**: PostgreSQL hosting (production configuration)
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management and caching

### Development Tools
- **Vite**: Fast build tool and development server
- **Drizzle**: Type-safe database toolkit
- **ESBuild**: Production build optimization
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: PostgreSQL with Drizzle ORM for persistent data storage
- **API Integration**: Direct Gemini API calls with environment variables

### Production Configuration
- **Build Process**: Vite frontend build + ESBuild backend bundle
- **Database**: PostgreSQL with Drizzle migrations
- **Environment Variables**: Database URL and API keys
- **Static Assets**: Optimized frontend served from Express

### Scalability Considerations
- **Database**: Ready for PostgreSQL scaling with connection pooling
- **Session Storage**: Can migrate from memory to database-backed sessions
- **AI Service**: Rate limiting and error handling for API calls
- **Caching**: TanStack Query provides client-side caching

The architecture is designed for rapid development while maintaining production-ready scalability. The modular design allows for easy feature additions and service integrations.

## Recent Changes

### January 31, 2025
- **Core Application Completed**: Built full-stack IntelliGuide AI recommendation chatbot
- **AI Integration**: Implemented Google Gemini API with category-specific conversation prompts
- **Firebase Integration**: Added Firebase Firestore support with fallback to in-memory storage
- **Voice Features**: Added speech-to-text input and text-to-speech output capabilities
- **User Interface**: Created responsive design with welcome page, category selection, and chat interface  
- **Speech Recognition**: Enhanced with robust error handling and browser compatibility (works best in Chrome/Edge)
- **Guest Mode**: Full functionality available without requiring user accounts
- **Categories**: Implemented 6 recommendation categories - fashion, health, travel, books, movies, music
- **Data Persistence**: Smart storage system with Firebase primary and memory fallback
- **Flexible Storage**: App works with Firebase Firestore, PostgreSQL, or in-memory depending on configuration