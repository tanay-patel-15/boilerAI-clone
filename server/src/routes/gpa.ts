import express from 'express';
import { pool } from '../index';

const router = express.Router();

// Calculate GPA
router.post('/calculate', async (req, res) => {
  try {
    const { grades } = req.body;

    if (!grades || !Array.isArray(grades)) {
      return res.status(400).json({ error: 'Grades array is required' });
    }

    const gpa = calculateGPA(grades);
    const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);

    res.json({
      gpa: gpa.toFixed(2),
      totalCredits,
      gradeCount: grades.length,
      breakdown: grades.map(grade => ({
        course: grade.course,
        grade: grade.grade,
        credits: grade.credits,
        points: getGradePoints(grade.grade) * grade.credits
      }))
    });
  } catch (error) {
    console.error('Calculate GPA error:', error);
    res.status(500).json({ error: 'Failed to calculate GPA' });
  }
});

// Save GPA record
router.post('/save', async (req, res) => {
  try {
    const { userId, semester, year, gpa, totalCredits, grades } = req.body;

    const result = await pool.query(
      `INSERT INTO gpa_records (user_id, semester, year, gpa, total_credits, grades_data, recorded_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [userId, semester, year, gpa, totalCredits, JSON.stringify(grades)]
    );

    res.status(201).json({
      message: 'GPA record saved successfully',
      recordId: result.rows[0].id,
      gpa,
      semester,
      year
    });
  } catch (error) {
    console.error('Save GPA error:', error);
    res.status(500).json({ error: 'Failed to save GPA record' });
  }
});

// Get user's GPA history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM gpa_records WHERE user_id = $1 ORDER BY recorded_at DESC',
      [userId]
    );

    // Calculate cumulative GPA
    const totalPoints = result.rows.reduce((sum, record) => sum + (record.gpa * record.total_credits), 0);
    const totalCredits = result.rows.reduce((sum, record) => sum + record.total_credits, 0);
    const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    res.json({
      records: result.rows,
      count: result.rows.length,
      cumulativeGPA: cumulativeGPA.toFixed(2),
      totalCredits
    });
  } catch (error) {
    console.error('Get GPA history error:', error);
    res.status(500).json({ error: 'Failed to fetch GPA history' });
  }
});

// Get GPA record by ID
router.get('/record/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    const result = await pool.query(
      'SELECT * FROM gpa_records WHERE id = $1',
      [recordId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'GPA record not found' });
    }

    const record = result.rows[0];
    record.grades_data = JSON.parse(record.grades_data);

    res.json({ record });
  } catch (error) {
    console.error('Get GPA record error:', error);
    res.status(500).json({ error: 'Failed to fetch GPA record' });
  }
});

// Predict future GPA
router.post('/predict', async (req, res) => {
  try {
    const { currentGPA, currentCredits, newGrades } = req.body;

    if (!currentGPA || !currentCredits || !newGrades) {
      return res.status(400).json({ error: 'Current GPA, credits, and new grades are required' });
    }

    const newGPA = predictGPA(currentGPA, currentCredits, newGrades);

    res.json({
      currentGPA: parseFloat(currentGPA).toFixed(2),
      predictedGPA: newGPA.toFixed(2),
      change: (newGPA - currentGPA).toFixed(2),
      newCredits: currentCredits + newGrades.reduce((sum, grade) => sum + grade.credits, 0)
    });
  } catch (error) {
    console.error('Predict GPA error:', error);
    res.status(500).json({ error: 'Failed to predict GPA' });
  }
});

// Helper functions
function calculateGPA(grades: any[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const points = getGradePoints(grade.grade) * grade.credits;
    totalPoints += points;
    totalCredits += grade.credits;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function getGradePoints(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  return gradeMap[grade.toUpperCase()] || 0.0;
}

function predictGPA(currentGPA: number, currentCredits: number, newGrades: any[]): number {
  const currentPoints = currentGPA * currentCredits;
  let newPoints = 0;
  let newCredits = 0;

  for (const grade of newGrades) {
    const points = getGradePoints(grade.grade) * grade.credits;
    newPoints += points;
    newCredits += grade.credits;
  }

  const totalPoints = currentPoints + newPoints;
  const totalCredits = currentCredits + newCredits;

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export default router; 