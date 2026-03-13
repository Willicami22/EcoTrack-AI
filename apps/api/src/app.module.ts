import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AiModule } from './ai/ai.module'
import { CarbonModule } from './carbon/carbon.module'
import { LoggingInterceptor } from './common/logging.interceptor'
import { envValidation } from './common/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidation,
    }),
    AiModule,
    CarbonModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
