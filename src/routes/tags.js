import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Buscar todas as tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tags.findMany();
    res.json(tags);
  } catch (error) {
    console.error('Erro real ao buscar tags:', error);
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});



export default router;