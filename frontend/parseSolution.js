export function parseSolutionMarkdown(solutionMarkdown) {
    console.log("=== PARSING SOLUTION ===");
    console.log("Input length:", solutionMarkdown?.length);
    
    if (!solutionMarkdown) {
        console.log("❌ No solution markdown provided");
        return [];
    }

    const solutionArray = [];
    
    // Updated regex to handle bold formatting in headings and various code block formats
    // Matches: ### **filename** or ### filename
    // Followed by: ```language or ``` 
    // Content until closing ```
    const regex = /###\s*\**(.*?)\**\s*\n```[^\n]*\n([\s\S]*?)```/g;
    
    let match;
    while ((match = regex.exec(solutionMarkdown)) !== null) {
        const filename = match[1].trim();
        const content = match[2].trim();
        
        // Skip the "File Structure" section as it's not a file
        if (filename.toLowerCase().includes('file structure')) {
            console.log(`Skipping: "${filename}" (file structure)`);
            continue;
        }
        
        console.log(`✅ Found file: "${filename}"`);
        console.log(`   Content length: ${content.length}`);
        
        solutionArray.push({ filename, content });
    }

    console.log(`Total files parsed: ${solutionArray.length}`);
    console.log("File names:", solutionArray.map(f => f.filename));
    console.log("========================");

    return solutionArray;
}