import { Test, TestingModule } from '@nestjs/testing'
import { CarbonService } from './carbon.service'
import { AiService } from '../ai/ai.service'
import type { AnalysisResult } from '@ecotrack/shared-types'

const mockAnalysisResult: AnalysisResult = {
  activities: [
    {
      category: 'transport',
      description: '5 camionetas de reparto',
      quantity: 5,
      unit: 'vehículos/día',
      co2_kg_estimate: 52.5,
      confidence: 'medium',
    },
    {
      category: 'energy',
      description: 'Consumo eléctrico 200 kWh',
      quantity: 200,
      unit: 'kWh',
      co2_kg_estimate: 25.2,
      confidence: 'high',
    },
  ],
  summary: 'Análisis de huella de carbono del negocio',
  total_co2_kg: 77.7,
  recommendations: [],
}

describe('CarbonService', () => {
  let service: CarbonService
  let aiService: jest.Mocked<AiService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarbonService,
        {
          provide: AiService,
          useValue: {
            analyzeActivities: jest.fn().mockResolvedValue(mockAnalysisResult),
          },
        },
      ],
    }).compile()

    service = module.get<CarbonService>(CarbonService)
    aiService = module.get(AiService)
  })

  it('debe estar definido', () => {
    expect(service).toBeDefined()
  })

  it('debe calcular el total de CO₂ correctamente', async () => {
    const result = await service.analyzeFootprint('Texto de prueba')
    expect(result.total_co2_kg).toBe(77.7)
    expect(aiService.analyzeActivities).toHaveBeenCalledWith('Texto de prueba')
  })

  it('debe agregar el contexto del tipo de negocio', async () => {
    await service.analyzeFootprint('Texto de prueba', 'Restaurante')
    expect(aiService.analyzeActivities).toHaveBeenCalledWith(
      '[Tipo de negocio: Restaurante]\nTexto de prueba'
    )
  })

  it('debe devolver factores de emisión', () => {
    const factors = service.getEmissionFactors()
    expect(factors.length).toBeGreaterThan(0)
    expect(factors[0]).toHaveProperty('category')
    expect(factors[0]).toHaveProperty('factor_kg_per_unit')
  })
})
