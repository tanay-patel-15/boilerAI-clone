import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'boiler_ai',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Boiler AI database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        major VARCHAR(100),
        graduation_year INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        credits DECIMAL(3,1) NOT NULL,
        major VARCHAR(100) NOT NULL,
        prerequisites TEXT[],
        semester_offered TEXT[],
        schedule_info JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create schedules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        semester VARCHAR(20) NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create schedule_courses junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_courses (
        id SERIAL PRIMARY KEY,
        schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(schedule_id, course_id)
      )
    `);

    // Create transcripts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transcripts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create transcript_analysis table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transcript_analysis (
        id SERIAL PRIMARY KEY,
        transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
        analysis_data JSONB NOT NULL,
        analyzed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create gpa_records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gpa_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        semester VARCHAR(20) NOT NULL,
        year INTEGER NOT NULL,
        gpa DECIMAL(3,2) NOT NULL,
        total_credits INTEGER NOT NULL,
        grades_data JSONB NOT NULL,
        recorded_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create chat_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert sample Purdue courses
    await insertSampleCourses();

    console.log('✅ Database setup completed successfully!');
    console.log('📚 Sample courses inserted');
    console.log('🎓 Ready for Boiler AI academic advising!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function insertSampleCourses() {
  const sampleCourses = [
    {
      course_code: 'CS 18000',
      title: 'Problem Solving And Object-Oriented Programming',
      description: 'Introduction to object-oriented programming and problem solving using Java.',
      credits: 4.0,
      major: 'Computer Science',
      prerequisites: [],
      semester_offered: ['Fall', 'Spring', 'Summer']
    },
    {
      course_code: 'CS 18200',
      title: 'Foundations Of Computer Science',
      description: 'Introduction to theoretical foundations of computer science.',
      credits: 3.0,
      major: 'Computer Science',
      prerequisites: ['CS 18000'],
      semester_offered: ['Fall', 'Spring']
    },
    {
      course_code: 'MA 16100',
      title: 'Plane Analytic Geometry And Calculus I',
      description: 'Introduction to calculus with applications.',
      credits: 5.0,
      major: 'Mathematics',
      prerequisites: [],
      semester_offered: ['Fall', 'Spring', 'Summer']
    },
    {
      course_code: 'MA 16200',
      title: 'Plane Analytic Geometry And Calculus II',
      description: 'Continuation of calculus with applications.',
      credits: 5.0,
      major: 'Mathematics',
      prerequisites: ['MA 16100'],
      semester_offered: ['Fall', 'Spring', 'Summer']
    },
    {
      course_code: 'ENGL 10600',
      title: 'First-Year Composition',
      description: 'Introduction to academic writing and research.',
      credits: 4.0,
      major: 'English',
      prerequisites: [],
      semester_offered: ['Fall', 'Spring', 'Summer']
    },
    {
      course_code: 'PHYS 17200',
      title: 'Modern Mechanics',
      description: 'Introduction to classical mechanics and modern physics.',
      credits: 4.0,
      major: 'Physics',
      prerequisites: ['MA 16100'],
      semester_offered: ['Fall', 'Spring']
    },
    {
      course_code: 'CHM 11500',
      title: 'General Chemistry',
      description: 'Introduction to general chemistry principles.',
      credits: 4.0,
      major: 'Chemistry',
      prerequisites: [],
      semester_offered: ['Fall', 'Spring', 'Summer']
    },
    {
      course_code: 'CS 24000',
      title: 'Programming In C',
      description: 'Introduction to C programming language.',
      credits: 3.0,
      major: 'Computer Science',
      prerequisites: ['CS 18000'],
      semester_offered: ['Fall', 'Spring']
    },
    {
      course_code: 'CS 25000',
      title: 'Computer Architecture',
      description: 'Introduction to computer organization and architecture.',
      credits: 4.0,
      major: 'Computer Science',
      prerequisites: ['CS 18200'],
      semester_offered: ['Fall', 'Spring']
    },
    {
      course_code: 'CS 25100',
      title: 'Data Structures And Algorithms',
      description: 'Advanced data structures and algorithm analysis.',
      credits: 4.0,
      major: 'Computer Science',
      prerequisites: ['CS 18200', 'CS 24000'],
      semester_offered: ['Fall', 'Spring']
    }
  ];

  for (const course of sampleCourses) {
    await pool.query(`
      INSERT INTO courses (course_code, title, description, credits, major, prerequisites, semester_offered)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (course_code) DO NOTHING
    `, [
      course.course_code,
      course.title,
      course.description,
      course.credits,
      course.major,
      course.prerequisites,
      course.semester_offered
    ]);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

export { setupDatabase }; 