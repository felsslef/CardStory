import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Buscar todas as tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});

// Buscar jogos por tags
router.post('/jogos-por-tags', async (req, res) => {
  const { tagIds } = req.body;

  if (!tagIds || tagIds.length === 0) {
    return res.status(400).json({ error: 'Nenhuma tag selecionada' });
  }

  try {
    // Encontrar jogos que tenham TODAS as tags selecionadas
    const jogos = await prisma.jogo.findMany({
      where: {
        tags: {
          every: {
            id: {
              in: tagIds
            }
          }
        }
      },
      include: {
        tags: true
      }
    });

    res.json(jogos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

export default router;