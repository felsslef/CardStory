import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Buscar jogos por nome da tag
router.get('/buscar-por-tag/:tagNome', async (req, res) => {
  const { tagNome } = req.params;

  try {
    const jogos = await prisma.jogos.findMany({
      where: {
        JogoTags: {
          some: {
            tag: {
              nome: {
                equals: tagNome,
                mode: 'insensitive'
              }
            }
          }
        }
      },
      include: {
        JogoTags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.json({ jogos });
  } catch (error) {
    console.error('Erro ao buscar jogos por tag:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

router.get('/', async (req, res) => {
  try {
    const jogos = await prisma.jogos.findMany({
      include: {
        JogoTags: {
          include: {
            tag: true
          }
        }
      }
    });
    res.json({ jogos });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;