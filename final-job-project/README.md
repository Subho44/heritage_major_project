# AI Based Smart Job Portal using MERN Stack & Cloud Deployment

This is a beginner-friendly major project with:
- React.js (Vite) + Tailwind CSS frontend
- Node.js + Express.js backend
- MongoDB database
- Email OTP based login
- Role based authentication: Admin, Recruiter, Job Seeker
- Job posting and management
- Resume upload (PDF)
- Application system and tracking
- Notifications
- Dashboard analytics
- Dark mode UI
- Chat collection and simple API structure

## Project Structure

- `backend/` -> API server
- `frontend/` -> React app

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=AI Smart Job Portal <your_gmail@gmail.com>
```

> If EMAIL_USER and EMAIL_PASS are empty, OTP will print in terminal for testing.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Default Flow

1. Register as admin / recruiter / jobseeker
2. Login with email + password
3. System sends OTP to email
4. Verify OTP and login
5. Based on role, dashboard changes automatically

## Main Collections

- Users
- Jobs
- Applications
- Resumes
- Notifications
- Chat

## Important Note

This project is designed for beginners and project submission. Code is kept short and simple for learning. You can later improve it with:
- Cloudinary resume upload
- Socket.io realtime chat
- Advanced analytics charts
- AI resume screening
- AI job recommendations
- Deployment on Render / Railway / AWS EC2
