require('dotenv').config();
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const videoRoutes = require('./routes/video');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api/comment', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('api/video', videoRoutes);

// Auth, video, vote routes will go here
const videoRoutes = require('./routes/video');
app.use('/api/video', videoRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Student Voting API is running 🎉');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
