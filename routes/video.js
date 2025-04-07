const express = require('express');
const multer = require('multer');
const upload = require('./services/s3Upload'); // s3Upload.js where you define multerS3
const prisma = new PrismaClient();

const router = express.Router();

// Video upload route
router.post('/upload', upload.single('video'), async (req, res) => {
  const { title, description } = req.body;
  const videoUrl = req.file.location;

  try {
    const newVideo = await prisma.video.create({
      data: {
        title,
        description,
        url: videoUrl,
      },
    });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video.' });
  }
});

module.exports = router;
