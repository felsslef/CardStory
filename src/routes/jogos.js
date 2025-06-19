import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Buscar todas as tags disponíveis
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tags.findMany({
      orderBy: {
        nome: 'asc'
      }
    });
    res.json(tags);
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});

// Buscar jogos por tags (AND - deve conter todas as tags selecionadas)
router.post('/jogos/tags', async (req, res) => {
  const { tagIds } = req.body;

  if (!tagIds || !Array.isArray(tagIds)) {
    return res.status(400).json({ error: 'IDs de tags inválidos' });
  }

  try {
    // Converter para números
    const numericTagIds = tagIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    // Buscar jogos que possuam TODAS as tags selecionadas
    const jogos = await prisma.jogos.findMany({
      where: {
        tags: {
          every: {
            tag_id: {
              in: numericTagIds
            }
          }
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Formatar a resposta
    const formattedJogos = jogos.map(jogo => ({
      id: jogo.id,
      nome: jogo.nome,
      descricao: jogo.descricao,
      imagem_url: jogo.imagem_url,
      data_lancamento: jogo.data_lancamento,
      tags: jogo.tags.map(jt => ({
        id: jt.tag.id,
        nome: jt.tag.nome
      }))
    }));

    res.json(formattedJogos);
  } catch (error) {
    console.error('Erro ao buscar jogos por tags:', error);
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

export default router;