# 📧 Hackathon-Email: Smart AI-Powered Email Management System

A modern, intelligent email management application built with React, TypeScript, and Microsoft Graph API integration. This application provides AI-powered email insights, smart categorization, and seamless Outlook integration.

## 🌟 Features

### 🔐 Authentication & Security
- **Microsoft Azure AD Integration**: Secure login with Microsoft accounts
- **MSAL (Microsoft Authentication Library)**: Industry-standard authentication
- **Office 365/Outlook Integration**: Direct access to your email data

### 📊 Smart Email Management
- **AI-Powered Email Analysis**: Intelligent categorization and insights
- **Multiple Inbox Views**: 
  - Default Inbox
  - Priority Inbox
  - Custom Inbox with filters
- **Email Prioritization**: Automatic email importance scoring
- **Advanced Search & Filtering**: Quick email discovery

### 🤖 AI Features
- **Smart Email Suggestions**: AI-powered response recommendations
- **Content Analysis**: Automatic email content categorization
- **Task Extraction**: Identify actionable items from emails
- **Sentiment Analysis**: Understand email tone and urgency

### 📅 Productivity Tools
- **Day Planner Integration**: Schedule management
- **Task Management**: Convert emails to actionable tasks
- **Calendar Sync**: Seamless calendar integration
- **Email Insights Dashboard**: Analytics and productivity metrics

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Microsoft Azure account** (for authentication setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SatyamDave/Hackathon-Email.git
   cd Hackathon-Email
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   touch .env
   ```
   
   Add the following variables to your `.env` file:
   ```env
   # Azure Active Directory Configuration
   VITE_AZURE_CLIENT_ID=your_azure_client_id
   VITE_AZURE_TENANT_ID=your_azure_tenant_id
   
   # Supabase Configuration (optional)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Azure OpenAI Configuration for AI Assistant
   VITE_AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   VITE_AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   VITE_AZURE_OPENAI_API_VERSION=2024-02-15-preview
   ```
   
   > **🤖 AI Assistant Setup**: The AI assistant requires Azure OpenAI credentials. See the `AZURE_OPENAI_SETUP.md` file for detailed setup instructions.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🏗️ Project Structure

```
Hackathon-Email/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── inbox/         # Inbox-related components
│   │   ├── AIPromptBox.tsx
│   │   ├── EmailList.tsx
│   │   ├── EmailDetail.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── data/              # Mock data and constants
│   ├── lib/               # External library configurations
│   ├── main.tsx          # Application entry point
│   ├── App.tsx           # Main App component
│   └── msalConfig.ts     # Microsoft Authentication config
├── package.json
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build tool configuration
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Authentication & APIs
- **Microsoft Graph API**: Email and calendar data access
- **Azure MSAL**: Microsoft Authentication Library
- **Fluent UI React**: Microsoft's design system components

### State Management & Data
- **React Query**: Server state management and caching
- **Zustand**: Lightweight state management
- **Supabase**: Backend database and real-time features
- **Axios**: HTTP client for API requests

### Development Tools
- **ESLint**: Code linting and quality
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Git Workflow
git checkout -b feature/your-feature-name
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

## 🔧 Configuration

### Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure:
   - **Name**: Hackathon-Email
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: `http://localhost:5173` (for development)
5. Note down the **Application (client) ID** and **Directory (tenant) ID**
6. Add required API permissions for Microsoft Graph

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from the settings
3. Set up required database tables for email metadata and user preferences

## 🎯 Key Components

### Core Components
- **`App.tsx`**: Main application component with routing
- **`Layout.tsx`**: Application layout with sidebar and main content
- **`Sidebar.tsx`**: Navigation and user profile sidebar
- **`EmailList.tsx`**: Email listing with filtering and sorting
- **`EmailDetail.tsx`**: Detailed email view with AI insights
- **`AIPromptBox.tsx`**: AI-powered email assistance

### Inbox Components
- **`DefaultInbox.tsx`**: Standard email inbox view
- **`PriorityInbox.tsx`**: Priority-sorted email view
- **`CustomInbox.tsx`**: Customizable inbox with filters

### Authentication
- **`AuthenticationModal.tsx`**: Login/logout interface
- **`LoginButton.tsx`**: Authentication trigger component
- **`useOutlookLogin.ts`**: Custom hook for Outlook authentication

## 🤖 AI Assistant

The AI Assistant is a powerful feature that helps you manage your emails more efficiently using Azure OpenAI.

### Features
- **Smart Email Analysis**: Get instant summaries of your emails
- **Intelligent Responses**: AI-powered suggestions for email replies
- **Action Item Extraction**: Automatically identify tasks and deadlines
- **Email Organization**: Get help prioritizing and categorizing emails
- **Natural Language Queries**: Ask questions about your emails in plain English

### Sample Interactions
- "Summarize my important emails from today"
- "Help me prioritize my unread messages"
- "Find any urgent action items in my inbox"
- "Draft a professional response to this email"
- "Organize my emails by project"

### Requirements
- Azure OpenAI API access
- Proper environment variables configured
- Internet connection for API calls

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment:
- Azure client and tenant IDs
- Supabase URL and keys
- Azure OpenAI credentials

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint rules for code consistency
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Browse existing GitHub issues
2. **Create New Issue**: Describe your problem with details
3. **Contact Team**: Reach out to the development team

## 📄 License

This project is part of a hackathon and is intended for educational and demonstration purposes.

## 🏆 Hackathon Information

This application was developed for [Hackathon Name] with the goal of creating an intelligent email management solution that leverages AI and modern web technologies to improve productivity and email organization.

---

**Happy Coding! 🚀**