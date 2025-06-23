import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/jogos-por-tags', async (req, res) => {
  try {
    let { tagIds } = req.body;

    // Validação e normalização
    if (!tagIds) tagIds = [];
    if (!Array.isArray(tagIds)) tagIds = [tagIds];
    
    const numericTagIds = tagIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id) && id > 0);

    if (numericTagIds.length === 0) {
      return res.json([]); // Retorna array vazio se nenhum ID válido
    }

    // Consulta com filtro AND (deve conter TODAS as tags)
    const jogos = await prisma.jogos.findMany({
      where: {
        AND: numericTagIds.map(tagId => ({
          JogoTags: {
            some: {
              tag_id: tagId
            }
          }
        }))
      },
      include: {
        JogoTags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.json(jogos);

  } catch (error) {
    console.error('Erro no filtro por tags:', error);
    res.status(500).json({ 
      error: 'Erro ao filtrar jogos',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Rota para buscar todos os jogos (GET)
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
    res.json(jogos); // Retorna diretamente o array de jogos
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota para criar novo jogo
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, imagem_url, tags } = req.body;
    
    // Cria o jogo e as associações em uma transação
    const novoJogo = await prisma.$transaction(async (prisma) => {
      // 1. Cria o jogo
      const jogo = await prisma.jogos.create({
        data: {
          nome,
          descricao,
          imagem_url
        }
      });
      
      // 2. Cria as associações com as tags (se houver)
      if (tags && tags.length > 0) {
        await prisma.JogoTags.createMany({
          data: tags.map(tagId => ({
            jogo_id: jogo.id,
            tag_id: tagId
          })),
          skipDuplicates: true  // Evita erros se alguma relação já existir
        });
      }
      
      return jogo;
    });
    
    // 3. Retorna o jogo com suas tags
    const jogoComTags = await prisma.jogos.findUnique({
      where: { id: novoJogo.id },
      include: {
        JogoTags: {
          include: {
            tag: true
          }
        }
      }
    });
    
    res.status(201).json(jogoComTags);
    
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ 
      error: 'Erro ao criar jogo',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para associar tags a jogos
router.post('/jogo-tags', async (req, res) => {
  try {
    const { jogo_id, tag_id } = req.body;
    
    const relacao = await prisma.JogoTags.create({
      data: {
        jogo_id: parseInt(jogo_id),
        tag_id: parseInt(tag_id)
      }
    });
    
    res.status(201).json(relacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao associar tag' });
  }
});

export default router;