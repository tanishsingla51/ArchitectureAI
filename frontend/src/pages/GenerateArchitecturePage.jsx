import React from 'react'
import { Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useApiStore from '../store/apiStore.js';
import { useAuth } from '@clerk/clerk-react';



const GenerateArchitecturePage = () => {

     // Use the Zustand store to get state and actions.
  const { 
    prompt, 
    solution, 
    isLoading, 
    isCopied, 
    error, 
    isFallback, 
    setPrompt, 
    generateSolution, 
    handleCopy 
  } = useApiStore();

  const { isSignedIn, getToken } = useAuth();

  const handleGenerateClick = () => {
    // Check if the user is signed in before calling the API.
    if (!isSignedIn) {
        // Since we removed the local state, we'll use an alert as a temporary prompt.
        // In a real application, you'd show a modal here.
       alert("Please sign in to generate a backend.");

        return;
    }
    // Call the action from the store, passing the getToken function.
    generateSolution(getToken);
  };

  return (
    <div>
      <section id="generator" className="bg-gray-50 py-16 md:py-20 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Generate Your Architecture</h2>
                <p className="text-gray-300 text-sm md:text-base">Describe your backend needs and get instant results</p>
              </div>

              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-3">
                Describe your backend architecture:
              </label>
              <textarea
                id="prompt"
                className="w-full h-28 md:h-32 bg-gray-800/80 text-white rounded-2xl p-4 mb-5 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 resize-none border border-gray-600/60 placeholder-gray-400 text-sm"
                placeholder="e.g., Create a user API with CRUD operations using Node.js, Express, and Prisma with a PostgreSQL database."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt}
                className={`w-full flex items-center justify-center py-3 md:py-4 px-6 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50
                  ${isLoading || !prompt ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-xl'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Architecture
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-900/90 backdrop-blur-sm border border-red-700/60 text-red-200 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="font-semibold">Error:</p>
                </div>
                {(error.includes('overloaded') || error.includes('Rate limit')) && (
                  <button
                    onClick={() => handleGenerateClick()}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Retrying...' : 'Retry'}
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {solution && (
            <div className="mt-6 bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-600/20 overflow-hidden">
              <div className="flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-800/80 px-6 py-4 border-b border-gray-600/60">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-white">Generated Architecture</h2>
                  {isFallback && (
                    <span className="ml-3 px-2 py-1 bg-yellow-600/80 text-yellow-100 text-xs rounded-lg font-medium">
                      Fallback Response
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center
                    ${isCopied ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-600/80 text-gray-300 hover:bg-gray-500/80'}`}
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
              <div className="p-6 overflow-auto max-h-[60vh] markdown-content text-gray-200">
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
      </section>
    </div>
  )
}

export default GenerateArchitecturePage
