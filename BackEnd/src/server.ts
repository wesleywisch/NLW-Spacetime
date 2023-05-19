import 'dotenv/config'
import { resolve } from 'node:path'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(cors, {
  origin: true, // Todos URLs de front-end poderão acessar o back-end
  // origin: ['http://google.com'], // Aqui as urls que estão é as que podem acessar o nosso backend
})
app.register(jwt, {
  secret: 'spacetime',
})
app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads'
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 Server running')
  })
