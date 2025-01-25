const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are an expert analyst who specializes in strengthening and expanding arguments. Your task is to take a brain dump of ideas and:
1. Identify the core arguments
2. Steelman each argument to its strongest form
3. Add supporting evidence and reasoning
4. Expand the implications
5. Find growth directions

Provide your analysis in these sections:

<connected_narrative>
Build the strongest possible case for the ideas presented:
[Your analysis here]
</connected_narrative>

<growth_points>
Identify promising directions to expand the idea:
[Growth points here]
</growth_points>

<ai_contributions>
Explain how you built upon the original ideas:
[Contributions here]
</ai_contributions>`;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const { idea } = JSON.parse(event.body);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Start the chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: systemPrompt,
        },
      ],
    });

    // Send the idea
    const result = await chat.sendMessage(
      `<brain_dump>${idea}</brain_dump>`
    );
    const response = result.response.text();

    // Extract sections using regex
    const extractSection = (text, section) => {
      const regex = new RegExp(`<${section}>(.*?)<\/${section}>`, 's');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const processed = {
      connected_narrative: extractSection(response, 'connected_narrative'),
      growth_points: extractSection(response, 'growth_points'),
      ai_contributions: extractSection(response, 'ai_contributions')
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processed)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process idea' })
    };
  }
};