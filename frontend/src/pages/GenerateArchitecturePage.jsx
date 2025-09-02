import React, { useEffect, useState, useRef } from "react";
import {
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  FileText,
  Folder,
  ChevronDown,
  Send,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import useApiStore from "../store/apiStore.js";
import { useAuth, useClerk } from "@clerk/clerk-react";
import GithubLoginButton from "../components/GithubLoginButton.jsx";
import { oneDark } from "https://esm.sh/react-syntax-highlighter/dist/esm/styles/prism";

const GenerateArchitecturePage = () => {
  const {
    prompt,
    solution,
    isLoading,
    isCopied,
    error,
    setPrompt,
    generateSolution,
    handleCopy,
  } = useApiStore();

  const { isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();

  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [copiedFiles, setCopiedFiles] = useState(new Set());
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const resultRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) clearTimeout(animationFrameId.current);
    };
  }, [solution]);

  useEffect(() => {
    if (solution) {
      let solutionArray = [];
      try {
        const jsonMatch = solution.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : solution;
        const cleanedJsonString = jsonString.replace(/\u00A0/g, " ").trim();
        solutionArray = JSON.parse(cleanedJsonString);
        if (!Array.isArray(solutionArray)) throw new Error("Parsed data is not an array.");
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        return;
      }

      setDisplayedFiles([]);
      setCurrentFileIndex(0);
      setIsTypingComplete(false);
      setCopiedFiles(new Set());
      setExpandedFiles(new Set([0, 1]));

      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
        const currentContent = currentFile.content || "";
        if (charIndex === 0) {
          setCurrentFileIndex(fileIndex);
          setDisplayedFiles((prev) => [
            ...prev,
            { filename: currentFile.filePath || `file-${fileIndex}`, content: "" },
          ]);
        }
        if (charIndex < currentContent.length) {
          setDisplayedFiles((prev) => {
            const newFiles = [...prev];
            if (newFiles[fileIndex]) {
              newFiles[fileIndex] = {
                ...newFiles[fileIndex],
                content: currentContent.substring(0, charIndex + 1),
              };
            }
            return newFiles;
          });
          charIndex++;
        } else {
          fileIndex++;
          charIndex = 0;
        }
        animationFrameId.current = setTimeout(typeNextChar, typingSpeed);
      };

      animationFrameId.current = setTimeout(typeNextChar, 100);
    }
  }, [solution]);

  useEffect(() => {
    const savedPrompt = localStorage.getItem("userPrompt");
    if (savedPrompt) {
      setPrompt(savedPrompt);
      localStorage.removeItem("userPrompt");
    }
  }, [setPrompt]);

  const handleGenerateClick = () => {
    if (!isSignedIn) {
      localStorage.setItem("userPrompt", prompt);
      openSignIn();
      return;
    }
    generateSolution(getToken);
  };

  const handleFileCopy = async (content, index) => {
    await navigator.clipboard.writeText(content);
    setCopiedFiles((prev) => new Set(prev).add(index));
    setTimeout(() => {
      setCopiedFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2000);
  };

  const toggleFileExpansion = (index) => {
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const getLanguageFromFilename = (filename = "") => {
    const ext = filename.split(".").pop().toLowerCase();
    const langMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      json: "json",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      sql: "sql",
      html: "html",
      css: "css",
      scss: "scss",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      md: "markdown",
      sh: "bash",
      env: "bash",
      gitignore: "gitignore",
    };
    return langMap[ext] || "text";
  };

  const getFileIcon = (filename = "") => {
    const ext = filename.split(".").pop().toLowerCase();
    const iconMap = {
      js: "JS",
      jsx: "JS",
      ts: "TS",
      tsx: "TS",
      json: "{}",
      py: "PY",
      md: "MD",
      html: "</>",
      css: "#",
    };
    if (filename.includes("/"))
      return <Folder className="h-4 w-4 text-blue-400" />;
    if (iconMap[ext])
      return <span className="text-xs font-mono w-4 text-center font-bold text-blue-400">{iconMap[ext]}</span>;
    return <FileText className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-800 text-white">
     

      {/* 🔹 Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-16 pb-28 space-y-6">
        <div className="max-w-3xl mx-auto w-full">
          {!solution && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center mt-20">
              <Sparkles className="h-10 w-10 text-green-400 mb-4" />
              <h2 className="text-2xl font-semibold">Generate Backend Architecture</h2>
              <p className="text-gray-400 text-sm mt-2">
                Describe your application requirements below to get started.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 text-red-300 p-4 rounded-xl border border-red-800 shadow-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {(isLoading || displayedFiles.length > 0) && (
            <div ref={resultRef} className="space-y-4">
              {isLoading && displayedFiles.length === 0 && (
                <div className="flex items-center gap-3 p-6 bg-neutral-800/70 backdrop-blur-md rounded-xl border border-neutral-700 shadow-md">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-300">Generating your architecture...</span>
                </div>
              )}

              {displayedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>
                      {isTypingComplete
                        ? `${displayedFiles.length} files generated`
                        : `Generating file ${currentFileIndex + 1}...`}
                    </span>
                    <div className="flex gap-3">
                      {isTypingComplete && (
                        <button
                          onClick={() => {
                            if (expandedFiles.size === displayedFiles.length)
                              setExpandedFiles(new Set());
                            else setExpandedFiles(new Set(displayedFiles.map((_, i) => i)));
                          }}
                          className="hover:text-white"
                        >
                          {expandedFiles.size === displayedFiles.length
                            ? "Collapse All"
                            : "Expand All"}
                        </button>
                      )}
                      <GithubLoginButton />
                      <button
                        onClick={() => handleCopy(solution)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                          isCopied
                            ? "bg-green-600 text-white"
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        {isCopied ? "Copied!" : "Copy All"}
                      </button>
                    </div>
                  </div>

                  {displayedFiles.map((file, index) => {
                    const isExpanded = expandedFiles.has(index);
                    const isCopiedFile = copiedFiles.has(index);
                    const language = getLanguageFromFilename(file.filename);

                    return (
                      <div
                        key={index}
                        className="bg-neutral-900/70 backdrop-blur-md border border-neutral-700 rounded-xl shadow-lg"
                      >
                        <div
                          onClick={() => toggleFileExpansion(index)}
                          className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-neutral-800/60"
                        >
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.filename)}
                            <span className="text-sm font-mono">{file.filename}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileCopy(file.content, index);
                              }}
                              className={`p-1 rounded ${
                                isCopiedFile
                                  ? "bg-green-600 text-white"
                                  : "hover:bg-neutral-600 text-gray-300"
                              }`}
                            >
                              {isCopiedFile ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        {isExpanded && (
                          <SyntaxHighlighter
                            language={language}
                            style={oneDark}
                            showLineNumbers
                            customStyle={{
                              margin: 0,
                              background: "#1e1f25",
                              fontSize: "13px",
                              padding: "16px",
                              borderRadius: "0 0 12px 12px",
                            }}
                          >
                            {file.content}
                          </SyntaxHighlighter>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Fixed Input Section */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-700 bg-neutral-800/80 backdrop-blur-md p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <textarea
            className="flex-1 bg-neutral-900/90 border border-neutral-700 text-white rounded-lg p-3 resize-none text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Message ArchitectureAI..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleGenerateClick();
              }
            }}
            rows={1}
          />
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !prompt.trim()}
            className={`p-3 rounded-lg shadow ${
              isLoading || !prompt.trim()
                ? "bg-gray-600 text-gray-400"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-1 text-xs text-gray-400 flex justify-between">
          <span>{prompt.length} characters</span>
          <span>⌘ + Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default GenerateArchitecturePage;
