const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;
    const video = await prisma.video.create({
      data: {
        title,
        url: req.file.location,
        uploaderId: req.user.id,
      },
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
};