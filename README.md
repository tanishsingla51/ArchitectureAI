# ArchitectureAI - AI Backend Generator

A powerful AI-powered tool that generates complete, structured backend applications based on natural language descriptions. Built with React frontend and Node.js backend, leveraging Google's Gemini AI for intelligent code generation.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini AI to understand natural language prompts and generate complete backend applications
- 🎨 **Modern UI**: Beautiful, responsive React frontend with Tailwind CSS
- 📝 **Markdown Output**: Generates well-formatted, structured code with syntax highlighting
- 🔧 **Multiple Technologies**: Supports various backend technologies and frameworks
- 📋 **Copy to Clipboard**: Easy copying of generated code
- ⚡ **Real-time Generation**: Fast, responsive AI-powered code generation

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Markdown
- React Syntax Highlighter
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Google Gemini AI API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd api-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cd ../backend
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

## Usage

1. **Describe your backend**: Enter a natural language description of the backend you want to create
2. **Generate**: Click "Generate Backend" to create your application
3. **Copy**: Use the copy button to copy the generated code to your clipboard
4. **Implement**: Use the generated code in your project

### Example Prompts

- "Create a user API with CRUD operations using Node.js, Express, and Prisma with a PostgreSQL database"
- "Build a REST API for a blog with authentication, posts, and comments using FastAPI and SQLAlchemy"
- "Generate a GraphQL API for an e-commerce platform with products, orders, and user management"

## Project Structure

```
api-generator/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── gemini.controller.js
│   │   │   ├── gemini.routes.js
│   │   │   └── gemini.service.js
│   │   └── server.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for providing the AI capabilities
- React and Vite teams for the excellent development tools
- Tailwind CSS for the beautiful styling framework 