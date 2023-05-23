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
        createdAt: 'asc',
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
        createdAt: memory.createdAt,
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

    const memory = await prisma.memory.findMany({
      where: {
        id,
        isPublic: true,
      },
      include: {
        user: true,
      }
    });

    return memory.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content,
        createdAt: memory.createdAt,
        createdBy: memory.user.name,
      }
    })
  })

  app.get('/memories', async (req, res) => {
    await req.jwtVerify();

    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.length >= 115 ? memory.content.substring(0, 115).concat('...') : memory.content,
        createdAt: memory.createdAt,
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
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
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
      isPublic: z.coerce.boolean().default(false),
    })

    const { id } = paramsSchema.parse(req.params)
    const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

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