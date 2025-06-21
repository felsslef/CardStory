import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import usuariosRoutes from './routes/register.js'
import tagsRoutes from './routes/tags.js'
import jogosRoutes from './routes/jogos.js'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/usuarios', usuariosRoutes)
app.use('/tags', tagsRoutes)
app.use('/jogos', jogosRoutes)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
