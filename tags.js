const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function popularTags() {
  try {
    // Gêneros
    await prisma.genero.createMany({
      data: [
        { nome: 'Acao' },
        { nome: 'Aventura' },
        { nome: 'RPG (Role-Playing Game)' },
        { nome: 'Simulacao' },
        { nome: 'Estrategia' },
        { nome: 'Puzzle' },
        { nome: 'Tiro' },
        { nome: 'Luta' },
        { nome: 'Esportes' },
        { nome: 'Corrida' }
      ],
      skipDuplicates: true,
    })

    // Modos de jogo
    await prisma.modoJogo.createMany({
      data: [
        { nome: 'Single Player' },
        { nome: 'Multiplayer' },
        { nome: 'Cooperativo' },
        { nome: 'Online' },
        { nome: 'Local' }
      ],
      skipDuplicates: true,
    })

    // Ambientações
    await prisma.ambientacao.createMany({
      data: [
        { nome: 'Ficcao Cientifica' },
        { nome: 'Fantasia' },
        { nome: 'Pos-apocaliptico' },
        { nome: 'Historico' },
        { nome: 'Realista' }
      ],
      skipDuplicates: true,
    })

    // Mecanicas
    await prisma.mecanica.createMany({
      data: [
        { nome: 'Mundo Aberto' },
        { nome: 'Narrativa Ramificada' },
        { nome: 'Construcao de Base' },
        { nome: 'Crafting' },
        { nome: 'Stealth' }
      ],
      skipDuplicates: true,
    })

    // Visuais / Plataformas
    await prisma.visualPlataforma.createMany({
      data: [
        { nome: '2D' },
        { nome: '3D' },
        { nome: 'Pixel Art' },
        { nome: 'VR' },
        { nome: 'Mobile' },
        { nome: 'PC' },
        { nome: 'Console' }
      ],
      skipDuplicates: true,
    })

    console.log('Tags inseridas/com atualizadas com sucesso!')
  } catch (error) {
    console.error('Erro ao inserir tags:', error)
  } finally {
    await prisma.$disconnect()
  }
}

popularTags()
