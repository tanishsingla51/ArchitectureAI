import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Copy, Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Login from './components/Login.jsx';
import useApiStore from './store/apiStore.js';

// Get Clerk Publishable Key from environment variable
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

function App() {
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
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            #generator {
              position: sticky;
              top: 0;
              z-index: 10;
            }
          }
        `
      }} />
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">ArchitectAI</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">Product</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Marketplace</a>
              <a href="#" className="hover:text-gray-900">Company</a>
            </nav>

            {/* Login Button */}
            <Login />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Top Banner */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 rounded-full px-6 py-2 text-sm text-gray-600">
              Generate backend architecture instantly.
              <a href="#generator" className="text-blue-600 hover:text-blue-700 ml-2">
                See how it works <ArrowRight className="inline h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Generate Backend<br />
              Architecture<br />
              Instantly
            </h1>
          </div>

          {/* Description */}
          <div className="text-center mb-12 max-w-3xl mx-auto relative">
            <p className="text-xl text-gray-600 leading-relaxed">
              Describe your project and get professional backend routes, file structures, and API designs in seconds. Built for developers who want to move fast without compromising on architecture quality.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Building
            </button>
            <button className="text-gray-700 hover:text-gray-900 font-semibold">
              View Examples <ArrowRight className="inline h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Generator Section */}
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">ArchitectAI</span>
              </div>
              <p className="text-sm text-gray-500">
                © copyright ArchitectAI 2024. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Generator</a></li>
                  <li><a href="#" className="hover:text-gray-700">Documentation</a></li>
                  <li><a href="#" className="hover:text-gray-700">API Reference</a></li>
                  <li><a href="#" className="hover:text-gray-700">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Templates</a></li>
                  <li><a href="#" className="hover:text-gray-700">Best Practices</a></li>
                  <li><a href="#" className="hover:text-gray-700">Tutorials</a></li>
                  <li><a href="#" className="hover:text-gray-700">Examples</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">About</a></li>
                  <li><a href="#" className="hover:text-gray-700">Blog</a></li>
                  <li><a href="#" className="hover:text-gray-700">Careers</a></li>
                  <li><a href="#" className="hover:text-gray-700">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Help Center</a></li>
                  <li><a href="#" className="hover:text-gray-700">Community</a></li>
                  <li><a href="#" className="hover:text-gray-700">Status</a></li>
                  <li><a href="#" className="hover:text-gray-700">Feedback</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <span className="text-8xl font-bold text-gray-100 opacity-20">ArchitectAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
