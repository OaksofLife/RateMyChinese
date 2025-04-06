
const authRoutes = require('./routes/auth');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Student Voting API is running 🎉');
});

// Auth, video, vote routes will go here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});