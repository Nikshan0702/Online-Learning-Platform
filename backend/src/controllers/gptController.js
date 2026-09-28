const Course = require('../models/Course');

// Recommend courses based on student's prompt and MongoDB courses
const getCourseRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;

    // 1. Validate prompt
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // 2. Get available courses from MongoDB
    const courses = await Course.find({}, 'title description content');

    if (!courses || courses.length === 0) {
      return res.status(200).json({
        recommendations: 'No courses are currently available on our platform.',
      });
    }

    // Format available courses list
    const courseListText = courses
      .map((c, idx) => `${idx + 1}. "${c.title}" - ${c.description}`)
      .join('\n');

    const apiKey = process.env.OPENAI_API_KEY;

    // 3. If OpenAI key is set and valid, call OpenAI API
    if (apiKey && apiKey !== 'your_openai_api_key_here' && apiKey !== 'your_openai_api_key') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are a course recommendation assistant. Only recommend courses from the provided course list. Do not invent courses that do not exist in the list.',
              },
              {
                role: 'user',
                content: `The following courses are available on our platform:\n\n${courseListText}\n\nBased on the student's request:\n"${prompt}"\n\nRecommend the most relevant available courses.\nFor each recommendation provide:\n- Course name\n- Short reason\n\nOnly recommend courses from the provided course list.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 400,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const gptMessage = data.choices?.[0]?.message?.content;
          if (gptMessage) {
            return res.status(200).json({ recommendations: gptMessage.trim() });
          }
        }
        console.warn('OpenAI API responded with non-200, falling back to smart local matching');
      } catch (openAiErr) {
        console.warn('OpenAI API call failed:', openAiErr.message);
      }
    }

    // 4. Intelligent fallback based on MongoDB courses (ensures MVP works without paid OpenAI key)
    const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const scoredCourses = courses.map((course) => {
      const text = `${course.title} ${course.description} ${course.content}`.toLowerCase();
      let matchCount = 0;
      keywords.forEach((word) => {
        if (text.includes(word)) matchCount++;
      });
      return { course, score: matchCount };
    });

    // Sort by match score or take top courses
    scoredCourses.sort((a, b) => b.score - a.score);
    const topMatches = scoredCourses.slice(0, 3);

    const fallbackRecommendations = topMatches
      .map(
        (item) =>
          `• Course: ${item.course.title}\n  Reason: Highly relevant to your interest in "${prompt.slice(0, 50)}...". Covers essential concepts: ${item.course.description}`
      )
      .join('\n\n');

    return res.status(200).json({
      recommendations: `Here are the top recommended courses available on our platform for you:\n\n${fallbackRecommendations}`,
    });
  } catch (error) {
    console.error('GPT recommendation error:', error.message);
    return res.status(500).json({ message: 'Server error while generating recommendations' });
  }
};

module.exports = {
  getCourseRecommendations,
};
