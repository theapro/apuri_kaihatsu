import { Router } from 'express';
import { prisma } from '@lib/prisma'; 

const router = Router();

// Xabar yuborish endpointi
router.post('/send', async (req, res) => {
  const { recipientId, message } = req.body;

  if (!recipientId || !message) {
    return res.status(400).json({ error: 'Recipient ID va message kerak' });
  }

  try {
    // Xabarni ma'lumotlar bazasiga qo'shish
    const newMessage = await prisma.message.create({
      data: {
        recipientId,
        message,
        sentAt: new Date(), // Xabar yuborilgan vaqt
      },
    });

    return res.status(200).json({ message: 'Xabar muvaffaqiyatli yuborildi', newMessage });
  } catch (error) {
    console.error('Xabar yuborishda xato:', error);
    return res.status(500).json({ error: 'Xabar yuborishda xato' });
  }
});

export default router;
