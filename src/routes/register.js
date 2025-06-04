import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  const { Nome, Sobrenome, Username, Sexo, DataNasc, Email, Senha, confirmSenha } = req.body

  // Validações simples
  if (!Nome || !Sobrenome || !Username || !Email || !Senha || !confirmSenha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' })
  }
  if (Senha !== confirmSenha) {
    return res.status(400).json({ error: 'Senha e confirmação não coincidem.' })
  }

  try {
    // Verifica se já existe username ou email
    const userExists = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Username },
          { Email }
        ]
      }
    })
    if (userExists) {
      return res.status(409).json({ error: 'Username ou email já existe.' })
    }

    // Cria usuário no banco
    const novoUsuario = await prisma.usuario.create({
      data: {
        Nome,
        Sobrenome,
        Username,
        Sexo,
        DataNasc: DataNasc ? new Date(DataNasc) : null,
        Email,
        Senha
      }
    })

    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: 'Erro ao criar usuário no servidor.' })
  }
})

export default router
