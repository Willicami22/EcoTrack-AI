import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'

export class AnalyzeCarbonDto {
  @IsString()
  @IsNotEmpty({ message: 'El texto de actividades no puede estar vacío' })
  @MinLength(10, { message: 'El texto debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'El texto no puede superar los 2000 caracteres' })
  text: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  businessType?: string
}
