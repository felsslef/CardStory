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

// Criar tag
router.post('/', async (req, res) => {
  try {
    const { nome, categoria } = req.body;
    if (!nome || !categoria) {
      return res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
    }
    const novaTag = await prisma.tags.create({
      data: { nome, categoria }
    });
    res.status(201).json(novaTag);
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    res.status(500).json({ error: 'Erro ao criar tag' });
  }
});

// Atualizar tag
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, categoria } = req.body;
    if (!nome || !categoria) {
      return res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
    }
    const tagAtualizada = await prisma.tags.update({
      where: { id },
      data: { nome, categoria }
    });
    res.json(tagAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    res.status(500).json({ error: 'Erro ao atualizar tag' });
  }
});

// Deletar tag
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.tags.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    res.status(500).json({ error: 'Erro ao deletar tag' });
  }
});

export default router;
