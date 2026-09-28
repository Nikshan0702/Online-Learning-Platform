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
                  'You are a course recommendation assistant. Only recommend courses from the provided list. Do not invent courses.',
              },
              {
                role: 'user',
                content: `Available courses on our platform:\n\n${courseListText}\n\nStudent request: "${prompt}"\n\nRecommend the most relevant courses from the list above. For each, give the course name and a short reason.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 400,
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
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const result = scored
      .map((item) => `• ${item.course.title}\n  ${item.course.description}`)
      .join('\n\n');

    return res.status(200).json({
      recommendations: `Based on your interest, here are recommended courses:\n\n${result}`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCourseRecommendations };
