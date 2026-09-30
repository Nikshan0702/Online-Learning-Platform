const Course = require('../models/Course');

const getCourseRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const courses = await Course.find({}, 'title description content');

    if (courses.length === 0) {
      return res.status(200).json({ recommendations: 'No courses available on the platform yet.' });
    }

    const courseListText = courses
      .map((c, i) => `${i + 1}. "${c.title}" - ${c.description}`)
      .join('\n');

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && !apiKey.startsWith('your_')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(7000),
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
                  'You are an educational assistant for an online learning platform. Recommend the best matching courses from the provided list based on the student request. Only recommend courses from the provided list. For each recommendation, provide the course title and a brief explanation.',
              },
              {
                role: 'user',
                content: `Available courses:\n\n${courseListText}\n\nStudent request: "${prompt}"\n\nRecommend the most relevant courses for this student.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.status(200).json({ recommendations: reply.trim() });
          }
        }
      } catch (err) {
        console.error('OpenAI error:', err.message);
      }
    }

    const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

    const scored = courses
      .map((course) => {
        const text = `${course.title} ${course.description} ${course.content}`.toLowerCase();
        const score = keywords.filter((word) => text.includes(word)).length;
        return { course, score };
      })
      .sort((a, b) => b.score - a.score);

    const matched = scored.filter((item) => item.score > 0);
    const selected = matched.length > 0 ? matched.slice(0, 3) : scored.slice(0, 3);

    const result = selected
      .map((item) => `• ${item.course.title}\n  ${item.course.description}`)
      .join('\n\n');

    return res.status(200).json({
      recommendations: `Based on your request, here are recommended courses:\n\n${result}`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCourseRecommendations };
