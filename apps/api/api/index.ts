import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import type { ExpressAdapter } from '@nestjs/platform-express'
import { AppModule } from '../src/app.module'
import { GlobalExceptionFilter } from '../src/common/global-exception.filter'
import type { Express } from 'express'
import type { IncomingMessage, ServerResponse } from 'http'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express') as () => Express

// Cache de la app para reutilizar entre invocaciones serverless
let cachedApp: Express | null = null

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp

  const expressApp = express()

  // Importación dinámica para evitar problemas con bundling en Vercel
  const { ExpressAdapter } = await import('@nestjs/platform-express')
  const adapter = new ExpressAdapter(expressApp) as unknown as ExpressAdapter

  const app = await NestFactory.create(AppModule, adapter, { logger: ['error', 'warn', 'log'] })

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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await bootstrap()
  app(req, res)
}
