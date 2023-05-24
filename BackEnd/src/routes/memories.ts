import { FastifyInstance } from "fastify";
import { z } from 'zod'

import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories/public', async (req, res) => {
    const memories = await prisma.memory.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        memoryDate: 'asc',
      },
      include: {
        user: true,
      }
    });

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.length >= 115 ? memory.content.substring(0, 115).concat('...') : memory.content,
        memoryDate: memory.memoryDate,
        createdBy: {
          name: memory.user.name,
          avatarUrl: memory.user.avatarUrl,
          githubLink: memory.user.login,
        },
      }
    })
  })

  app.get('/memories/public/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id,
        isPublic: true,
      },
      include: {
        user: true,
      }
    });

    let memoryFormatted = {
      id: memory.id,
      coverUrl: memory.coverUrl,
      content: memory.content,
      isPublic: memory.isPublic,
      memoryDate: memory.memoryDate,
      createdBy: {
        name: memory.user.name,
        avatarUrl: memory.user.avatarUrl,
        githubLink: memory.user.login,
      }
    }

    return memoryFormatted
  })

  app.get('/memories', async (req, res) => {
    await req.jwtVerify();

    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub,
      },
      orderBy: {
        memoryDate: 'asc',
      }
    });

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.length >= 115 ? memory.content.substring(0, 115).concat('...') : memory.content,
        memoryDate: memory.memoryDate,
      }
    })
  })

  app.get('/memories/:id', async (req, res) => {
    await req.jwtVerify();

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    return memory;
  })
  app.post('/memories', async (req, res) => {
    await req.jwtVerify();

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      memoryDate: z.string().datetime(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic, memoryDate } = bodySchema.parse(req.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        memoryDate,
        userId: req.user.sub,
      }
    });

    return memory
  })
  app.put('/memories/:id', async (req, res) => {
    await req.jwtVerify();

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      memoryDate: z.string().datetime(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { id } = paramsSchema.parse(req.params)
    const { content, coverUrl, isPublic, memoryDate } = bodySchema.parse(req.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
        memoryDate,
      }
    })

    return memory
  })
  app.delete('/memories/:id', async (req, res) => {
    await req.jwtVerify();

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      }
    })
  })
}