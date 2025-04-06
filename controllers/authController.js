const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePasswords } = require('../utils/hash');

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashed = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        tokens: {
          create: [1, 2, 3, 4, 5].map((value) => ({
            value,
          })),
        },
      },
    });

    const token = generateToken(newUser);
    res.json({ token, user: { id: newUser.id, email: newUser.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await comparePasswords(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { register, login };