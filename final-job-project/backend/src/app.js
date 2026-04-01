import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from 'http';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:'http://localhost:5173',
    methods:['GET','POST'],
  }
})

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve('src/uploads')));

app.get('/', (_, res) => {
  res.json({ message: 'AI Smart Job Portal API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

const users = {};
io.on('connection',(socket)=>{
  console.log('user connected:',socket.id);
  socket.on('join',(userId)=>{
    users[userId] = socket.id;
  });
  socket.on('sendMessage',(messageData)=>{
    const reciverscoketid = users[messageData.reciver];

    if(reciverscoketid) {
      io.to(reciverscoketid).emit('reciveMessage',messageData);
    }
  });
  socket.on('disconnect',()=>{
    console.log('user disconnected');
  })
})
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || 'Server error' });
});

export default app;