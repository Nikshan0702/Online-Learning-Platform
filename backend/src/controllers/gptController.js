const Course = require('../models/Course');

const getCourseRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const courses = await Course.find({}, 'title description content instructor')
      .populate('instructor', 'name email');

    if (courses.length === 0) {
      return res.status(200).json({
        message: 'No courses available on the platform yet.',
        courses: [],
        recommendations: 'No courses available on the platform yet.',
      });
    }

    const courseListText = courses
      .map((c, i) => `${i + 1}. [ID: ${c._id}] "${c.title}" - ${c.description}`)
      .join('\n');

    const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const scored = courses
      .map((course) => {
        const text = `${course.title} ${course.description} ${course.content}`.toLowerCase();
        const score = keywords.filter((word) => text.includes(word)).length;
        return { course, score };
      })
      .sort((a, b) => b.score - a.score);

    const matched = scored.filter((item) => item.score > 0);
    const topScored = matched.length > 0 ? matched.slice(0, 3) : scored.slice(0, 3);
    const fallbackList = topScored.map((item) => item.course);

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
                  'You are an educational assistant for an online learning platform. Recommend the best matching courses from the provided list based on the student request. Only recommend courses from the provided list. Return clear recommendations mentioning the course titles.',
              },
              {
                role: 'user',
                content: `Available courses on our platform:\n\n${courseListText}\n\nStudent request: "${prompt}"\n\nRecommend the most relevant courses for this student and explain why.`,
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
            const mentioned = courses.filter((c) =>
              reply.toLowerCase().includes(c.title.toLowerCase())
            );
            const recommendedCourses = mentioned.length > 0 ? mentioned : fallbackList;

            return res.status(200).json({
              message: reply.trim(),
              courses: recommendedCourses,
              recommendations: reply.trim(),
            });
          }
        }
      } catch (err) {
        console.error('OpenAI error:', err.message);
      }
    }

    const textSummary = fallbackList
      .map((c) => `• ${c.title}\n  ${c.description}`)
      .join('\n\n');

    return res.status(200).json({
      message: 'Based on your learning goals, here are the best matching courses available on our platform:',
      courses: fallbackList,
      recommendations: `Based on your request, here are recommended courses:\n\n${textSummary}`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCourseRecommendations };
