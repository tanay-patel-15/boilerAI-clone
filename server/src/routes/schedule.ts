import express from 'express';
import { pool } from '../index';

const router = express.Router();

// Create a new schedule
router.post('/', async (req, res) => {
  try {
    const { userId, semester, year, courses } = req.body;

    // Validate courses don't have conflicts
    const conflicts = await checkScheduleConflicts(courses);
    if (conflicts.length > 0) {
      return res.status(400).json({
        error: 'Schedule conflicts detected',
        conflicts
      });
    }

    // Create schedule
    const scheduleResult = await pool.query(
      `INSERT INTO schedules (user_id, semester, year, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [userId, semester, year]
    );

    const scheduleId = scheduleResult.rows[0].id;

    // Add courses to schedule
    for (const courseId of courses) {
      await pool.query(
        `INSERT INTO schedule_courses (schedule_id, course_id)
         VALUES ($1, $2)`,
        [scheduleId, courseId]
      );
    }

    res.status(201).json({
      message: 'Schedule created successfully',
      scheduleId,
      semester,
      year,
      courseCount: courses.length
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Get user's schedules
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT s.*, 
              COUNT(sc.course_id) as course_count,
              SUM(c.credits) as total_credits
       FROM schedules s
       LEFT JOIN schedule_courses sc ON s.id = sc.schedule_id
       LEFT JOIN courses c ON sc.course_id = c.id
       WHERE s.user_id = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [userId]
    );

    res.json({
      schedules: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get schedule details with courses
router.get('/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    // Get schedule info
    const scheduleResult = await pool.query(
      'SELECT * FROM schedules WHERE id = $1',
      [scheduleId]
    );

    if (scheduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Get courses in schedule
    const coursesResult = await pool.query(
      `SELECT c.*, sc.id as schedule_course_id
       FROM courses c
       JOIN schedule_courses sc ON c.id = sc.course_id
       WHERE sc.schedule_id = $1
       ORDER BY c.course_code`,
      [scheduleId]
    );

    res.json({
      schedule: scheduleResult.rows[0],
      courses: coursesResult.rows,
      courseCount: coursesResult.rows.length
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Add course to schedule
router.post('/:scheduleId/courses', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { courseId } = req.body;

    // Check if course is already in schedule
    const existingCourse = await pool.query(
      'SELECT * FROM schedule_courses WHERE schedule_id = $1 AND course_id = $2',
      [scheduleId, courseId]
    );

    if (existingCourse.rows.length > 0) {
      return res.status(400).json({ error: 'Course already in schedule' });
    }

    // Add course to schedule
    await pool.query(
      'INSERT INTO schedule_courses (schedule_id, course_id) VALUES ($1, $2)',
      [scheduleId, courseId]
    );

    res.json({
      message: 'Course added to schedule successfully',
      scheduleId,
      courseId
    });
  } catch (error) {
    console.error('Add course error:', error);
    res.status(500).json({ error: 'Failed to add course to schedule' });
  }
});

// Remove course from schedule
router.delete('/:scheduleId/courses/:courseId', async (req, res) => {
  try {
    const { scheduleId, courseId } = req.params;

    const result = await pool.query(
      'DELETE FROM schedule_courses WHERE schedule_id = $1 AND course_id = $2',
      [scheduleId, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found in schedule' });
    }

    res.json({
      message: 'Course removed from schedule successfully',
      scheduleId,
      courseId
    });
  } catch (error) {
    console.error('Remove course error:', error);
    res.status(500).json({ error: 'Failed to remove course from schedule' });
  }
});

// Check schedule conflicts
async function checkScheduleConflicts(courseIds: number[]): Promise<any[]> {
  const conflicts: any[] = [];
  
  // Get all course schedules
  const coursesResult = await pool.query(
    'SELECT id, course_code, title, schedule_info FROM courses WHERE id = ANY($1)',
    [courseIds]
  );

  const courses = coursesResult.rows;
  
  // Simple conflict checking (in real implementation, this would be more sophisticated)
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const course1 = courses[i];
      const course2 = courses[j];
      
      // Check if courses have overlapping schedules
      if (course1.schedule_info && course2.schedule_info) {
        // This is a simplified check - real implementation would parse actual time slots
        if (course1.schedule_info === course2.schedule_info) {
          conflicts.push({
            course1: course1.course_code,
            course2: course2.course_code,
            conflict: 'Time overlap'
          });
        }
      }
    }
  }

  return conflicts;
}

export default router; 