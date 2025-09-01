import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import useApiStore from "../store/apiStore.js";

export default function PushCodeButton() {
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState(null);
  const { getToken } = useAuth();

  const { solution } = useApiStore();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handlePushCode = async () => {
    setLoading(true);
    setRepoUrl(null);

    const token = await getToken();

    try {
      console.log("Original solution:", solution);
      console.log("Solution type:", typeof solution);
      console.log("Is array?", Array.isArray(solution));

      let solutionArray = [];

      // Handle different solution formats
      if (Array.isArray(solution)) {
        // Solution is already an array
        console.log("✅ Solution is already an array");
        solutionArray = solution;
      } else if (typeof solution === 'string') {
        // Solution might be JSON string wrapped in markdown
        console.log("Solution is a string, attempting to parse...");
        
        try {
          // Try to extract JSON from markdown code block
          const jsonMatch = solution.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : solution;
          
          const parsed = JSON.parse(jsonString);
          if (Array.isArray(parsed)) {
            console.log("✅ Successfully parsed JSON array from string");
            solutionArray = parsed;
          } else {
            throw new Error("Parsed JSON is not an array");
          }
        // eslint-disable-next-line no-unused-vars
        } catch (parseError) {
            
          console.log("❌ Failed to parse as JSON, falling back to markdown parser");
          // Fallback to original markdown parsing (if you still want to support it)
          const { parseSolutionMarkdown } = await import("../../parseSolution.js");
          solutionArray = parseSolutionMarkdown(solution);
        }
      } else {
        throw new Error("Unknown solution format");
      }

      console.log("Final solutionArray:", solutionArray);

      if (!solutionArray || solutionArray.length === 0) {
        alert("No files found in solution to push to GitHub");
        return;
      }

      const payload = {
        solution: {
          files: solutionArray.map(file => ({
            path: file.filePath || file.filename || file.path,   // Handle different property names
            content: file.content,
          }))
        }
      };

      console.log("Payload to be sent:", payload);

      const res = await fetch(`${API_URL}/api/github/create-repo-and-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setRepoUrl(data.repoUrl);
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error("Error pushing code:", err);
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handlePushCode}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Pushing..." : "Push Code to GitHub"}
      </button>

      {repoUrl && (
        <p className="mt-2 text-green-600">
          ✅ Repo created!{" "}
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View on GitHub
          </a>
        </p>
      )}
    </div>
  );
}