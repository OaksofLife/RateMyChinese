const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Comment Route - Create a new comment
router.post('/:videoId/comment', async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id, // Assuming you're handling authentication
        videoId,
      },
    });

    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// Fetch comments for a video
router.get('/:videoId/comments', async (req, res) => {
  const { videoId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { videoId },
      include: {
        author: true, // Include author info (e.g., username)
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
