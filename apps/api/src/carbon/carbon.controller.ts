import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { CarbonService } from './carbon.service'
import { AnalyzeCarbonDto } from './dto/analyze-carbon.dto'
import type { AnalysisResult, EmissionFactor } from '@ecotrack/shared-types'

@Controller('carbon')
export class CarbonController {
  constructor(private readonly carbonService: CarbonService) {}

  /**
   * POST /carbon/analyze
   * Analiza el texto del usuario y devuelve la huella de carbono desglosada.
   */
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyze(@Body() dto: AnalyzeCarbonDto): Promise<AnalysisResult> {
    return this.carbonService.analyzeFootprint(dto.text, dto.businessType)
  }

  /**
   * GET /carbon/factors
   * Devuelve la tabla de factores de emisión de referencia.
   */
  @Get('factors')
  getFactors(): EmissionFactor[] {
    return this.carbonService.getEmissionFactors()
  }
}
