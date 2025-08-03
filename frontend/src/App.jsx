import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [prompt, setPrompt] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSolution = async () => {
    setIsLoading(true);
    setSolution('');
    setError(null);
    setIsCopied(false);

    try {
      const response = await fetch('http://localhost:3001/api/generate-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch solution from backend.');
      }

      const data = await response.json();
      setSolution(data.solution);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const markdownText = solution;
    navigator.clipboard.writeText(markdownText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 font-sans p-8 flex flex-col items-center antialiased">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-black text-center mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-500 to-purple-600">
          ArchitectureAI
        </h1>
        <p className="text-center text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
          Describe the backend you need in natural language, and I'll generate a complete, structured application based on your specifications.
        </p>

        <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-glow">
          <label htmlFor="prompt" className="block text-sm md:text-base font-semibold text-gray-300 mb-3">
            Your Prompt:
          </label>
          <textarea
            id="prompt"
            className="w-full h-40 bg-gray-800 text-white rounded-xl p-4 mb-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 resize-none placeholder-gray-500"
            placeholder="e.g., Create a user API with CRUD operations using Node.js, Express, and Prisma with a PostgreSQL database."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>

          <button
            onClick={handleGenerateSolution}
            disabled={isLoading || !prompt}
            className={`w-full flex items-center justify-center py-3 md:py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-500/50
              ${isLoading || !prompt ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 transform hover:-translate-y-1 active:scale-95'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generate Backend'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-red-300 p-4 rounded-xl mt-8 border border-red-700">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {solution && (
          <div className="mt-8 relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
            <div className="flex justify-between items-center bg-gray-800 px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold text-gray-200">Generated Solution</h2>
              <button
                onClick={handleCopy}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-300 flex items-center
                  ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copy All
                  </>
                )}
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-auto max-h-[70vh] markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {solution}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;