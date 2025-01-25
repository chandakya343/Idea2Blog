const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const { narrative } = JSON.parse(event.body);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a Style-Enhanced Blog Content Generator. Transform this draft into an engaging, intellectually rigorous blog post that maintains authentic voice while elevating analytical depth.

INPUT:
<draft>
${narrative}
</draft>

TRANSFORMATION GUIDELINES:

1. Structure and Flow
- Create a compelling hook opening
- Organize content into clear sections
- Use subheadings for navigation
- Ensure smooth transitions between ideas
- End with a strong conclusion

2. Writing Style
- Maintain a professional yet engaging tone
- Use active voice
- Include relevant examples and illustrations
- Break down complex concepts
- Add appropriate technical depth

3. Content Enhancement
- Expand key points with supporting details
- Include relevant context where needed
- Address potential questions proactively
- Balance theory and practical application
- Maintain intellectual rigor

4. Reader Engagement
- Use clear, accessible language
- Include thought-provoking questions
- Add relevant real-world connections
- Create dialogue with the reader
- Maintain interest throughout

5. Formatting
- Use proper paragraph structure
- Include strategic whitespace
- Emphasize key points
- Format code or technical content appropriately
- Add pull quotes for important insights

6. Blog-Specific Elements
- Add a clear title
- Include a brief introduction/summary
- Use bullet points sparingly
- Add section breaks where appropriate
- Ensure proper citation format if needed

Output the final blog post in <styled_draft></styled_draft> tags. The content should maintain all original ideas while enhancing their presentation and accessibility.

Remember:
- Keep ALL original concepts and ideas
- Only enhance the presentation and style
- Maintain the original voice while improving clarity
- Focus on making complex ideas accessible
- Ensure proper formatting for web reading</styled_draft>`;

    // Generate the blog post
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract the styled draft
    const extractBlog = (text) => {
      const regex = /<styled_draft>(.*?)<\/styled_draft>/s;
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const blogPost = extractBlog(response);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // For CORS support
      },
      body: JSON.stringify({ blog_post: blogPost })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to finalize blog',
        details: error.message 
      })
    };
  }
};