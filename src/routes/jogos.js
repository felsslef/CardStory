// routes/jogos.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/search', async (req, res) => {
  const filtro = req.body; 
  // filtro tem por exemplo:
  // { generos: ['Ação'], ambientacoes: ['Futurista'], mecanicas: ['Stealth'], visuaisPlataformas: ['3D'] }

  try {
    const jogos = await prisma.jogo.findMany({
      where: {
        AND: [
          filtro.generos ? {
            generos: {
              some: {
                genero: {
                  nome: { in: filtro.generos }
                }
              }
            }
          } : undefined,

          filtro.ambientacoes ? {
            ambientacoes: {
              some: {
                ambientacao: {
                  nome: { in: filtro.ambientacoes }
                }
              }
            }
          } : undefined,

          filtro.mecanicas ? {
            mecanicas: {
              some: {
                mecanica: {
                  nome: { in: filtro.mecanicas }
                }
              }
            }
          } : undefined,

          filtro.visuaisPlataformas ? {
            visuaisPlataformas: {
              some: {
                visualPlataforma: {
                  nome: { in: filtro.visuaisPlataformas }
                }
              }
            }
          } : undefined,
        ].filter(Boolean) // remove undefined pra não quebrar a query
      },
      distinct: ['id']
    });

    res.json(jogos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

export default router;
