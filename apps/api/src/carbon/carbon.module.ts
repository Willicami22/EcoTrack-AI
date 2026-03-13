import { Module } from '@nestjs/common'
import { CarbonController } from './carbon.controller'
import { CarbonService } from './carbon.service'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [AiModule],
  controllers: [CarbonController],
  providers: [CarbonService],
})
export class CarbonModule {}
