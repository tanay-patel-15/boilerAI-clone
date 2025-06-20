import express from 'express';
import { openai, pool } from '../index';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    // Get user's academic info for context
    const userQuery = await pool.query(
      'SELECT major, graduation_year FROM users WHERE id = $1',
      [userId]
    );

    const userInfo = userQuery.rows[0];
    
    // Create system prompt with Purdue context
    const systemPrompt = `You are Boiler AI, an academic advisor for Purdue University students. 
    You help students with course planning, degree requirements, and academic guidance.
    
    Current student info:
    - Major: ${userInfo?.major || 'Not specified'}
    - Graduation Year: ${userInfo?.graduation_year || 'Not specified'}
    
    Provide helpful, accurate advice about Purdue courses, requirements, and academic planning.
    Always mention specific Purdue course codes when relevant (e.g., CS 18000, MA 16100).
    Be encouraging and supportive while being informative.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...(context || []),
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Save conversation to database
    await pool.query(
      `INSERT INTO chat_history (user_id, user_message, ai_response, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, message, aiResponse]
    );

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Get course recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, interests, completedCourses, semester } = req.body;

    // Get user's major and completed courses
    const userQuery = await pool.query(
      'SELECT major FROM users WHERE id = $1',
      [userId]
    );

    const major = userQuery.rows[0]?.major;

    // Get available courses for the major
    const coursesQuery = await pool.query(
      `SELECT * FROM courses 
       WHERE major = $1 
       AND semester_offered @> $2::text[]
       AND prerequisites IS NULL OR prerequisites = '{}'
       ORDER BY course_code`,
      [major, [semester]]
    );

    // Use AI to rank and recommend courses
    const courseList = coursesQuery.rows.map(course => 
      `${course.course_code}: ${course.title} (${course.credits} credits)`
    ).join('\n');

    const recommendationPrompt = `Based on the following information, recommend 5 courses for a ${major} student:

Student Interests: ${interests}
Completed Courses: ${completedCourses?.join(', ') || 'None'}
Available Courses:
${courseList}

Please recommend 5 courses with brief explanations for each recommendation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an academic advisor at Purdue University. Provide specific course recommendations with clear reasoning." },
        { role: "user", content: recommendationPrompt }
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const recommendations = completion.choices[0]?.message?.content || 'Unable to generate recommendations.';

    res.json({
      recommendations,
      availableCourses: coursesQuery.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get chat history
router.get('/chat-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const history = await pool.query(
      `SELECT user_message, ai_response, created_at 
       FROM chat_history 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      history: history.rows.reverse(),
      count: history.rows.length
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router; 