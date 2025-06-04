import express from 'express'
import path from 'path'
import usuariosRoutes from './routes/register.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/usuarios', usuariosRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
