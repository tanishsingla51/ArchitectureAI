import React, { useEffect, useState , useRef } from 'react';
import { Copy, Check, Sparkles, AlertCircle, FileText, Folder , ChevronDown, ChevronsRightLeft } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import useApiStore from '../store/apiStore.js';
import { useAuth ,useClerk } from '@clerk/clerk-react';
import GithubLoginButton from '../components/GithubLoginButton.jsx';
import { oneDark } from 'https://esm.sh/react-syntax-highlighter/dist/esm/styles/prism';

const GenerateArchitecturePage = () => {
  const {
    prompt,
    solution,
    isLoading,
    isCopied,
    error,
    setPrompt,
    generateSolution,
    handleCopy
  } = useApiStore();
  
  // Using a mock for Clerk hooks as they need a Provider wrapper.
  // In a real app, these would work as long as <ClerkProvider> is at the root.
  const { isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();

  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [copiedFiles, setCopiedFiles] = useState(new Set());
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const resultRef = useRef(null);
  const animationFrameId = useRef(null); // Ref to hold animation frame ID for cleanup

  useEffect(() => {
    // Cleanup function to cancel animation when component unmounts or solution changes
    return () => {
      if (animationFrameId.current) {
        clearTimeout(animationFrameId.current);
      }
    };
  }, [solution]);

  useEffect(() => {
    if (solution) {
      let solutionArray = [];
      try {
        console.log("Solution received, attempting to parse...");
        const jsonMatch = solution.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : solution;
        const cleanedJsonString = jsonString.replace(/\u00A0/g, ' ').trim();
        solutionArray = JSON.parse(cleanedJsonString);

        if (!Array.isArray(solutionArray)){
            throw new Error("Parsed data is not an array.");
        }
        console.log("✅ Successfully parsed solution.");

      } catch (parseError) {
        console.error("❌ Failed to parse JSON from backend:", parseError);
        return; 
      }
      
      // Reset state for the new animation
      setDisplayedFiles([]);
      setCurrentFileIndex(0);
      setIsTypingComplete(false);
      setCopiedFiles(new Set());
      setExpandedFiles(new Set([0, 1])); 
      
      if(resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      let fileIndex = 0;
      let charIndex = 0;
      const typingSpeed = 5;

      const typeNextChar = () => {
        if (fileIndex >= solutionArray.length) {
          setIsTypingComplete(true);
          return;
        }

        const currentFile = solutionArray[fileIndex];
        const currentContent = currentFile.content || '';

        if (charIndex === 0) {
          setCurrentFileIndex(fileIndex);
          setDisplayedFiles(prev => [
            ...prev,
            { 
              filename: currentFile.filePath || `file-${fileIndex}`,
              content: '' 
            }
          ]);
        }

        if (charIndex < currentContent.length) {
          setDisplayedFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[fileIndex]) {
              newFiles[fileIndex] = {
                ...newFiles[fileIndex],
                content: currentContent.substring(0, charIndex + 1)
              };
            }
            return newFiles;
          });
          charIndex++;
        } else {
          fileIndex++;
          charIndex = 0;
        }
        // Store the timeout ID so it can be cleared
        animationFrameId.current = setTimeout(typeNextChar, typingSpeed);
      };
      
      // Start the animation
      animationFrameId.current = setTimeout(typeNextChar, 100);
    }
  }, [solution]);

  useEffect(() => {
    const savedPrompt = localStorage.getItem('userPrompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
      localStorage.removeItem('userPrompt');
    }
  }, [setPrompt]);

  const handleGenerateClick = () => {
    if (!isSignedIn) {
      localStorage.setItem('userPrompt', prompt);
      openSignIn();
      return;
    }
    generateSolution(getToken);
  };

  const handleFileCopy = async (content, index) => {
    await navigator.clipboard.writeText(content);
    setCopiedFiles(prev => new Set(prev).add(index));
    setTimeout(() => {
      setCopiedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2000);
  };

  const toggleFileExpansion = (index) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getLanguageFromFilename = (filename = '') => {
    const ext = filename.split('.').pop().toLowerCase();
    const langMap = {
      js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
      json: 'json', py: 'python', java: 'java', cpp: 'cpp', c: 'c',
      php: 'php', rb: 'ruby', go: 'go', rs: 'rust', sql: 'sql',
      html: 'html', css: 'css', scss: 'scss', yaml: 'yaml', yml: 'yaml',
      xml: 'xml', md: 'markdown', sh: 'bash', env: 'bash', gitignore: 'gitignore'
    };
    return langMap[ext] || 'text';
  };

  const getFileIcon = (filename = '') => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        js: 'JS', jsx: 'JS', ts: 'TS', tsx: 'TS',
        json: '{}', py: 'PY', md: 'MD',
        html: '</>', css: '#',
    };
    if (filename.includes('/')) return <Folder className="h-4 w-4 text-sky-400" />;
    if (iconMap[ext]) return <span className="text-xs font-mono w-4 text-center font-bold text-sky-400">{iconMap[ext]}</span>;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-sky-500 pb-2">
            Instant Backend Architecture
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mt-4">
            Describe your application, and let AI craft the complete file structure and code for you in seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700 p-6 relative backdrop-blur-sm">
            <textarea
              id="prompt"
              className="w-full h-28 bg-transparent text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 resize-none border border-gray-600 placeholder-gray-500"
              placeholder="e.g., A simple Express.js server with a health check route..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !prompt}
              className={`w-full mt-4 flex items-center justify-center py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50
                ${isLoading || !prompt 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-sky-600 hover:from-green-600 hover:to-sky-700 text-white transform hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-green-500/20'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Building...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Architecture
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        {(isLoading || displayedFiles.length > 0) && (
          <div ref={resultRef} className="mt-12 max-w-5xl mx-auto">
            <div className="bg-[#1e293b] rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800/60 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <h2 className="text-sm font-medium text-gray-300">Generated Architecture</h2>
                </div>
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => handleCopy(solution)}
                    className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-300 flex items-center
                      ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <GithubLoginButton />
                </div>
              </div>
              
              {isLoading && displayedFiles.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                    <p>Generating files, please wait...</p>
                </div>
              )}

              <div className="max-h-[70vh] overflow-y-auto">
                {displayedFiles.map((file, index) => {
                  const isExpanded = expandedFiles.has(index);
                  const isCopiedFile = copiedFiles.has(index);
                  const language = getLanguageFromFilename(file.filename);
                  const isCurrentlyTyping = index === currentFileIndex && !isTypingComplete;
                  
                  return (
                    <div key={index} className="border-b border-gray-700/50 last:border-b-0">
                      <div 
                        className="bg-slate-800/50 px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-700/50 transition-colors"
                        onClick={() => toggleFileExpansion(index)}
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.filename)}
                          <span className="font-mono text-sm text-gray-200">{file.filename}</span>
                          {isCurrentlyTyping && <span className="w-2 h-4 bg-sky-400 animate-pulse rounded-sm ml-2"></span>}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleFileCopy(file.content, index); }}
                            className={`py-1 px-2.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center
                              ${isCopiedFile ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                          >
                            {isCopiedFile ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div>
                          <SyntaxHighlighter
                            language={language}
                            style={oneDark}
                            showLineNumbers={true}
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              background: '#0f172a',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              fontFamily: "'Fira Code', 'Operator Mono', 'Source Code Pro', monospace",
                            }}
                            lineNumberStyle={{ color: '#4b5563', fontSize: '12px' }}
                          >
                            {file.content}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-800/60 px-4 py-2 border-t border-gray-700">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-medium">
                    {isTypingComplete 
                      ? `${displayedFiles.length} files generated successfully.`
                      : `Generating file ${currentFileIndex + 1}...`}
                  </span>
                  {isTypingComplete && (
                    <button
                      onClick={() => {
                        if (expandedFiles.size === displayedFiles.length) setExpandedFiles(new Set());
                        else setExpandedFiles(new Set(displayedFiles.map((_, i) => i)));
                      }}
                      className="hover:text-white font-medium transition-colors flex items-center gap-1.5"
                    >
                      <ChevronsRightLeft size={14} />
                      {expandedFiles.size === displayedFiles.length ? 'Collapse All' : 'Collapse All'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateArchitecturePage;