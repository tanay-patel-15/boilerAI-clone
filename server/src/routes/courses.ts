import express from 'express';
import { pool } from '../index';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { major, semester, search } = req.query;
    
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (major) {
      paramCount++;
      query += ` AND major = $${paramCount}`;
      params.push(major);
    }

    if (semester) {
      paramCount++;
      query += ` AND $${paramCount} = ANY(semester_offered)`;
      params.push(semester);
    }

    if (search) {
      paramCount++;
      query += ` AND (course_code ILIKE $${paramCount} OR title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY course_code';

    const result = await pool.query(query, params);
    res.json({
      courses: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course: result.rows[0] });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get courses by major
router.get('/major/:major', async (req, res) => {
  try {
    const { major } = req.params;
    const result = await pool.query(
      'SELECT * FROM courses WHERE major = $1 ORDER BY course_code',
      [major]
    );

    res.json({
      courses: result.rows,
      count: result.rows.length,
      major
    });
  } catch (error) {
    console.error('Get courses by major error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get available majors
router.get('/majors/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT major FROM courses ORDER BY major'
    );

    res.json({
      majors: result.rows.map(row => row.major)
    });
  } catch (error) {
    console.error('Get majors error:', error);
    res.status(500).json({ error: 'Failed to fetch majors' });
  }
});

// Get course prerequisites
router.get('/:id/prerequisites', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT prerequisites FROM courses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const prerequisites = result.rows[0].prerequisites || [];
    
    // Get detailed info for each prerequisite
    if (prerequisites.length > 0) {
      const prereqDetails = await pool.query(
        'SELECT id, course_code, title, credits FROM courses WHERE course_code = ANY($1)',
        [prerequisites]
      );

      res.json({
        prerequisites: prereqDetails.rows,
        count: prereqDetails.rows.length
      });
    } else {
      res.json({
        prerequisites: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('Get prerequisites error:', error);
    res.status(500).json({ error: 'Failed to fetch prerequisites' });
  }
});

export default router; 