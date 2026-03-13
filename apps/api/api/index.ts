// reflect-metadata DEBE ser el primer import — requerido por NestJS decorators
import 'reflect-metadata'

import express from 'express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import type { Express, Request, Response } from 'express'
import { AppModule } from '../src/app.module'
import { GlobalExceptionFilter } from '../src/common/global-exception.filter'

// Cache de la instancia para reutilizar entre invocaciones en la misma VM serverless
let cachedApp: Express | null = null

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp

  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  })

  app.enableCors({
    origin: process.env['CORS_ORIGIN'] ?? 'https://eco-track-ai-web.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())

  await app.init()

  cachedApp = expressApp
  return cachedApp
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await bootstrap()
    app(req, res)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error de inicialización'
    console.error('[EcoTrack API] Bootstrap error:', message)
    res.status(500).json({ error: 'Internal server error', message })
  }
}
