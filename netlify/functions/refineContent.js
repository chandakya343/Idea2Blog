const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    // Parse the incoming request body
    const { refinement, currentNarrative } = JSON.parse(event.body);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt
    const prompt = `You are refining and improving a narrative based on specific feedback. Your task is to evolve the current narrative while maintaining its core ideas and structure.

Current narrative:
<current_narrative>
${currentNarrative}
</current_narrative>

Refinement request:
<refinement_focus>
${refinement}
</refinement_focus>

Provide your refined analysis in these sections:

<connected_narrative>
[Evolve the narrative to incorporate the refinement while maintaining flow and coherence]
</connected_narrative>

<growth_points>
[Updated opportunities and directions based on the refinement:
- New areas opened by these developments
- Deepened aspects that invite further exploration
- Emerging connections to investigate]
</growth_points>

<ai_contributions>
[How you evolved the narrative:
- Areas you deepened
- New connections drawn
- Strengthened arguments
- Added context and support]
</ai_contributions>`;

    // Generate the refined content
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract sections using regex
    const extractSection = (text, section) => {
      const regex = new RegExp(`<${section}>(.*?)<\/${section}>`, 's');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    // Process the response
    const processed = {
      connected_narrative: extractSection(response, 'connected_narrative'),
      growth_points: extractSection(response, 'growth_points'),
      ai_contributions: extractSection(response, 'ai_contributions')
    };

    // Return the processed result
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // For CORS support
      },
      body: JSON.stringify(processed)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to refine content',
        details: error.message 
      })
    };
  }
};