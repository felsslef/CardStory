import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/usuarios', async (req, res) => {
  const { Nome, Sobrenome, Username, Sexo, DataNasc, Email, Senha } = req.body;

  try {
    // Verificar se o username já existe
    const userExistente = await prisma.usuario.findUnique({
      where: { Username }
    });
    if (userExistente) {
      return res.status(400).json({ error: 'Esse nome de usuário já está em uso.' });
    }

    // Verificar se o email já existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { Email }
    });
    if (emailExistente) {
      return res.status(400).json({ error: 'Esse e-mail já está em uso.' });
    }

    // Criar usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        Nome,
        Sobrenome,
        Username,
        Sexo,
        DataNasc: new Date(DataNasc),
        Email,
        Senha
      }
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
});

export default router;

