import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, Min, validateSync } from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsString()
  OPENAI_API_KEY: string

  @IsString()
  OPENAI_MODEL: string = 'gpt-4o-mini'

  @IsNumber()
  @Min(1)
  PORT: number = 3001

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development
}

export function envValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
