# Boiler AI Clone

A comprehensive AI academic advisor for Purdue University students, built with React, TypeScript, Express.js, PostgreSQL, and OpenAI integration.

## 🎓 Features

- **AI-Driven Chat**: Instant course recommendations and academic advice
- **Course Database**: 108 majors and 147 programs at Purdue
- **Transcript Analysis**: Upload and analyze academic transcripts
- **Schedule Builder**: Create conflict-free course schedules
- **GPA Calculator**: Calculate and track grade point averages
- **Progress Tracking**: Monitor graduation progress
- **User Authentication**: Secure login and registration system

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Lucide React** for icons
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** for database
- **OpenAI API** for AI features
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boilerAI-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy server environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=boiler_ai
   DB_PASSWORD=your_password
   DB_PORT=5432
   OPENAI_API_KEY=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
   JWT_SECRET=your_jwt_secret
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb boiler_ai
   
   # Run database setup
   npm run setup-db
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

## 📁 Project Structure

```
boilerAI-clone/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── index.tsx       # App entry point
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── database/       # Database setup
│   │   └── index.ts        # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### AI Features
- `POST /api/ai/chat` - AI chat interface
- `POST /api/ai/recommendations` - Course recommendations
- `GET /api/ai/chat-history/:userId` - Chat history

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/major/:major` - Get courses by major
- `GET /api/courses/majors/list` - Get available majors

### Schedule
- `POST /api/schedule` - Create schedule
- `GET /api/schedule/user/:userId` - Get user schedules
- `GET /api/schedule/:scheduleId` - Get schedule details

### Transcript
- `POST /api/transcript/upload` - Upload transcript
- `POST /api/transcript/analyze/:transcriptId` - Analyze transcript
- `GET /api/transcript/user/:userId` - Get user transcripts

### GPA
- `POST /api/gpa/calculate` - Calculate GPA
- `POST /api/gpa/save` - Save GPA record
- `GET /api/gpa/history/:userId` - Get GPA history

## 🎨 UI Components

The application uses a custom design system with Purdue University branding:

- **Colors**: Purdue Gold (#CFB991), Purdue Black (#000000)
- **Typography**: Inter font family
- **Components**: Custom button, card, and input styles
- **Animations**: Fade-in and slide-up transitions

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Secure file upload handling

## 📊 Database Schema

The application includes the following main tables:
- `users` - User accounts and profiles
- `courses` - Course catalog with prerequisites
- `schedules` - User course schedules
- `transcripts` - Uploaded transcript files
- `gpa_records` - GPA tracking and history
- `chat_history` - AI conversation logs

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database credentials
- Set up proper CORS origins
- Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original Boiler AI project by Rohit V. R.
- Built for Purdue University students
- Uses OpenAI's GPT models for AI features

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Boiler AI Clone** - Your AI Academic Advisor for Purdue University 🎓