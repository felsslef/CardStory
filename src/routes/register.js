import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // IMPORTANTE

const router = express.Router();
const prisma = new PrismaClient();

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

// rota de login

router.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Email: login },
          { Username: login }
        ]
      }
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.Senha); // usando bcryptjs aqui

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        Nome: usuario.Nome,
        Username: usuario.Username,
        Email: usuario.Email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});


export default router;