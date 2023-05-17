import fastify from 'fastify'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(cors, {
  origin: true, // Todos URLs de front-end poderão acessar o back-end
  // origin: ['http://google.com'], // Aqui as urls que estão é as que podem acessar o nosso backend
})
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 Server running')
  })
