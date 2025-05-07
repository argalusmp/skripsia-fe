# SkripsiA - AI Chatbot Frontend

This is the frontend application for an AI chatbot thesis project. It features user authentication, admin knowledge management (RAG), and a student chat interface.

## Features

- **Authentication System**
  - Login/Register functionality
  - Role-based access (Admin/Student)

- **Admin Dashboard**
  - Knowledge management (upload text, PDF/images, voice files)
  - Knowledge base viewing

- **Student Chat Interface**
  - Chat with AI assistant
  - Text input

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd skripsia-fe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Adjust the URL to point to your backend API server.

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API Endpoints

The application uses the following API endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token
- `GET /users/me` - Get current user information

### Knowledge Management
- `POST /knowledge/upload` - Upload knowledge (text, file, voice)
- `GET /knowledge` - Get list of all knowledge entries

### Chat
- `POST /chat/send` - Send a message to the AI
- `GET /chat/conversations/:id` - Get conversation by ID

## Folder Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
  - `auth` - Authentication components
  - `admin` - Admin-specific components
  - `chat` - Chat interface components
  - `ui` - Reusable UI components
- `src/lib` - Utility functions and services
  - `auth.tsx` - Authentication context
  - `chat.ts` - Chat-related API services
  - `utils.ts` - Utility functions

## Technology Stack

- React.js
- Next.js
- TypeScript
- Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
