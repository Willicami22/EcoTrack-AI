import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import type { ApiErrorResponse } from '@ecotrack/shared-types'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Error interno del servidor'

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      error: request.url,
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}: ${message}`
    )

    response.status(status).json(errorResponse)
  }
}
