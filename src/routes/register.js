import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para registro
router.post('/register', async (req, res) => {
  const { Nome, Sobrenome, Username, Sexo, DataNasc, Email, Senha, confirmSenha } = req.body;

  if (!Nome || !Sobrenome || !Username || !Email || !Senha || !confirmSenha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  if (Senha !== confirmSenha) {
    return res.status(400).json({ error: 'Senha e confirmação não coincidem.' });
  }

  try {
    const userExists = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Username },
          { Email }
        ]
      }
    });

    if (userExists) {
      return res.status(409).json({ error: 'Username ou email já existe.' });
    }

    const senhaCriptografada = await bcrypt.hash(Senha, 15);

    const novoUsuario = await prisma.usuario.create({
      data: {
        Nome,
        Sobrenome,
        Username,
        Sexo,
        DataNasc: DataNasc ? new Date(DataNasc) : null,
        Email,
        Senha: senhaCriptografada
      }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário no servidor.' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Email: login },
          { Username: login }
        ]
      },
      select: {
        Nome: true,
        Username: true,
        Email: true,
        Senha: true,
        fotoUrl: true
      }
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        Nome: usuario.Nome,
        Username: usuario.Username,
        Email: usuario.Email,
        fotoUrl: usuario.fotoUrl
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Rota para atualizar foto do usuário
router.put('/update-photo', async (req, res) => {
  const { username, fotoUrl } = req.body;

  if (!username || !fotoUrl) {
    return res.status(400).json({ error: 'Username e URL são obrigatórios' });
  }

  try {
    // Validação da URL
    new URL(fotoUrl);
  } catch {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    // Busca usuário pelo Username
    const user = await prisma.usuario.findUnique({
      where: { Username: username }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualiza a foto
    const updated = await prisma.usuario.update({
      where: { Username: username },
      data: { fotoUrl },
      select: { Nome: true, Username: true, fotoUrl: true }
    });

    res.json({ success: true, user: updated });

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

export default router;
