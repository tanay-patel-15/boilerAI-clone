import express from 'express';
import multer from 'multer';
import { pool } from '../index';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  },
});

// Upload transcript
router.post('/upload', upload.single('transcript'), async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save file info to database
    const result = await pool.query(
      `INSERT INTO transcripts (user_id, filename, file_size, mime_type, uploaded_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      [userId, file.originalname, file.size, file.mimetype]
    );

    res.json({
      message: 'Transcript uploaded successfully',
      transcriptId: result.rows[0].id,
      filename: file.originalname
    });
  } catch (error) {
    console.error('Upload transcript error:', error);
    res.status(500).json({ error: 'Failed to upload transcript' });
  }
});

// Get user's transcripts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM transcripts WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );

    res.json({
      transcripts: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get transcripts error:', error);
    res.status(500).json({ error: 'Failed to fetch transcripts' });
  }
});

// Analyze transcript (placeholder for AI analysis)
router.post('/analyze/:transcriptId', async (req, res) => {
  try {
    const { transcriptId } = req.params;
    
    // Get transcript info
    const transcriptQuery = await pool.query(
      'SELECT * FROM transcripts WHERE id = $1',
      [transcriptId]
    );

    if (transcriptQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    // Placeholder for AI analysis
    // In a real implementation, this would use OCR and AI to extract course data
    const analysis = {
      totalCredits: 0,
      gpa: 0.0,
      completedCourses: [],
      remainingRequirements: [],
      estimatedGraduationDate: null,
      academicStanding: 'Good Standing'
    };

    // Save analysis results
    await pool.query(
      `INSERT INTO transcript_analysis (transcript_id, analysis_data, analyzed_at)
       VALUES ($1, $2, NOW())`,
      [transcriptId, JSON.stringify(analysis)]
    );

    res.json({
      message: 'Transcript analysis completed',
      analysis,
      transcriptId
    });
  } catch (error) {
    console.error('Analyze transcript error:', error);
    res.status(500).json({ error: 'Failed to analyze transcript' });
  }
});

// Get analysis results
router.get('/analysis/:transcriptId', async (req, res) => {
  try {
    const { transcriptId } = req.params;
    const result = await pool.query(
      'SELECT * FROM transcript_analysis WHERE transcript_id = $1 ORDER BY analyzed_at DESC LIMIT 1',
      [transcriptId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      analysis: JSON.parse(result.rows[0].analysis_data),
      analyzedAt: result.rows[0].analyzed_at
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

export default router; 