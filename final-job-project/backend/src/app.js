import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import resumeairoutes from './routes/resumeAiRoutes.js';
import Groq from 'groq-sdk';


dotenv.config();
const groq = new Groq({
  apiKey:process.env.GROQ_API_KEY,
});

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve('src/uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'AI Smart Job Portal API running' });
});
//chat
app.post('/api/chat', async(req,res)=>{
  try {
    const {message} = req.body;
    if(!message) {
      return res.status(400).json({reply:"message is required"});
    }

    const completion = await groq.chat.completions.create({
      model:'llama-3.3-70b-versatile',
      messages:[
        {
          role:'system',
          content:'you are a helpfull chatboat..'
        },
        {
          role:'user',
          content:message,
        },
      ],
      temperature:0.7,
      max_tokens:300,
    });

    const reply = completion.choices[0]?.message?.content ||'No response';
    res.json({reply});

  } catch(err){
    console.error(err);
  }
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resume-ai',resumeairoutes);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    if (!userId) return;

    users[userId] = socket.id;
    console.log('User joined:', userId);
  });

  socket.on('sendMessage', (messageData) => {
    try {
      if (!messageData || !messageData.receiver) return;

      const receiverSocketId = users[messageData.receiver];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', messageData);
      }
    } catch (error) {
      console.error('Socket message error:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    message: err.message || 'Server error',
  });
});

export { app, server };