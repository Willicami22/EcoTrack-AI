# Bitácora de Desarrollo — EcoTrack AI
### Capstone Vibe Coding · 9no Semestre · Innovación con Nuevas Tecnologías

> **Fecha de inicio:** 12 de marzo de 2026
> **Stack:** TurboRepo · Next.js 14 · NestJS 10 · OpenAI GPT-4o · TypeScript Strict
> **Desarrollador:** EcoTrack AI Team
> **Asistente IA:** Claude Code (claude-sonnet-4-6)

---

## 1. Prompts Principales Utilizados

### Establecer CLAUDE.md

Se realizo primero el documento CLAUDE.md que da todas las pautas al modelo de inteligencia artificial de como trabajar para lograr el mejor resultado. Se puede encontrar aqui mismo en este repositorio

### Prompt Maestro — Inicialización del Proyecto

Este fue el prompt de arranque enviado a Claude Code para comenzar la construcción del monorepo completo:

```
# 🌱 EcoTrack AI — Master Prompt para Claude Code

## Tu rol
Eres el arquitecto y desarrollador principal de "EcoTrack AI", un MVP web
que ayuda a pequeños negocios a calcular su huella de carbono usando
lenguaje natural. Trabajarás de forma autónoma, tomando decisiones técnicas
fundamentadas y documentando cada paso importante.

---

## Misión inmediata
Construye desde cero el monorepo completo y funcional del proyecto.
Antes de escribir cualquier línea de código, lee el archivo CLAUDE.md
en la raíz del proyecto y úsalo como tu contrato de trabajo absoluto.
Confirma en un mensaje que entendiste: la estructura TurboRepo, el stack,
las convenciones y el scope del MVP antes de proceder.

---

## Stack (no negociable)
- Monorepo: TurboRepo + pnpm workspaces
- Frontend: Next.js 14 con App Router (TypeScript strict)
- Backend: NestJS 10 (TypeScript strict)
- Estilos: Tailwind CSS + shadcn/ui — paleta emerald/green
- IA: OpenAI SDK (gpt-4o-mini en dev, gpt-4o en prod)
- Validación: Zod en web · class-validator en api
- Tipos compartidos: packages/shared-types

---

## Lo que debes construir (en este orden exacto)

### FASE 1 — Scaffolding del monorepo
1. Inicializa el TurboRepo con pnpm workspaces
2. Configura turbo.json con pipelines: dev, build, test, lint
3. Crea los workspaces: apps/web, apps/api, packages/shared-types,
   packages/ui, packages/eslint-config
4. Configura TypeScript strict en todos los paquetes con tsconfig base
   compartido
5. Instala y configura ESLint + Prettier unificados
6. Crea el .env.example con todas las variables necesarias
7. Crea un .gitignore apropiado para el monorepo

### FASE 2 — packages/shared-types
Define PRIMERO todos los tipos compartidos:
```typescript
// Actividad de carbono extraída por la IA
interface CarbonActivity {
  category: 'transport' | 'energy' | 'waste' | 'water' | 'other'
  description: string
  quantity: number
  unit: string
  co2_kg_estimate: number
  confidence: 'high' | 'medium' | 'low'
}

// Respuesta del análisis de IA
interface AnalysisResult {
  activities: CarbonActivity[]
  summary: string
  total_co2_kg: number
  recommendations: string[]
}

// DTO para el request de análisis
interface AnalyzeRequestDto {
  text: string
  businessType?: string
}


### FASE 3 — Backend NestJS (apps/api)
Construye los siguientes módulos en orden:

**AppModule** (raíz)
- ConfigModule global con validación de variables de entorno
- Habilitar CORS para http://localhost:3000

**AiModule**
- AiService que encapsula el cliente de OpenAI
- Método analyzeActivities(text: string): Promise<AnalysisResult>
- Usar response_format: { type: 'json_object' } obligatoriamente
- System prompt que extrae actividades de carbono con factores GHG Protocol
- Manejo de errores: si OpenAI falla, lanzar HttpException apropiada
- Temperatura: 0.2 para respuestas consistentes

**CarbonModule**
- CarbonController con:
  - POST /carbon/analyze → recibe texto, devuelve AnalysisResult
  - GET /carbon/factors → devuelve tabla de factores de emisión
- CarbonService con:
  - Método que llama a AiService y enriquece el resultado
  - Método que genera top 3 recomendaciones basadas en las actividades
  - Almacenamiento en memoria (Map) de los últimos 10 análisis por sesión

**CommonModule**
- GlobalExceptionFilter para respuestas de error consistentes
- LoggingInterceptor para loguear requests/responses
- ValidationPipe global con whitelist: true, transform: true

### FASE 4 — Frontend Next.js (apps/web)
Construye en este orden:

**Configuración base**
- Tailwind con paleta personalizada emerald/green/slate
- shadcn/ui inicializado
- Variables CSS para el tema oscuro/claro
- Layout raíz con metadata SEO básica para EcoTrack AI

**Página principal (app/page.tsx)**
El flujo de UX es:
1. Hero section minimalista con tagline y CTA
2. Chat interface donde el usuario escribe sus actividades
3. Panel de resultados que aparece tras el análisis:
   - Total CO₂ en kg (número grande y prominente)
   - Gráfico de dona con breakdown por categoría
   - Lista de actividades detectadas con nivel de confianza
   - Top 3 recomendaciones con íconos

**Componentes a crear** (en packages/ui o apps/web/components):
- <ChatInput /> — textarea con botón de analizar y ejemplos sugeridos
- <ResultsDashboard /> — contenedor del análisis completo
- <CarbonDonutChart /> — gráfico de dona (usar recharts)
- <ActivityCard /> — tarjeta individual por actividad detectada
- <RecommendationCard /> — tarjeta de recomendación con ícono
- <LoadingAnalysis /> — skeleton/spinner mientras la IA procesa

**Hook personalizado**
- useAnalysis() — maneja el estado del análisis, loading, error y
  la llamada al backend

**Ejemplos sugeridos** (mostrar como chips clickeables debajo del input):
- "Usamos 5 camionetas de reparto y gastamos 200 kWh de luz"
- "3 empleados viajaron en avión a Bogotá, vuelo de 1 hora"
- "Generamos 50 kg de residuos y usamos gas natural por 8 horas"

### FASE 5 — Integración y Polish
- Verifica que el flujo completo funciona end-to-end
- Agrega manejo de errores en el frontend (toast notifications)
- Asegura que el diseño es responsive (mobile-first)
- Agrega animaciones suaves con Tailwind transitions
- Verifica que `pnpm dev` levanta ambas apps en paralelo sin errores

---

## Criterios de calidad obligatorios
- Cero errores de TypeScript en modo strict
- Todos los endpoints del backend tienen DTOs validados
- El frontend nunca llama directamente a OpenAI (solo al backend)
- Los tipos NO están duplicados entre apps (todo viene de shared-types)
- El CLAUDE.md en la raíz existe y está actualizado

---

## Cuando encuentres un problema
1. Lee el error completo antes de actuar
2. Documenta el bug en docs/debugging-log.md con: síntoma, causa raíz
   y solución aplicada
3. Si es un error de tipos, busca primero en packages/shared-types
4. Si es un error de la API de OpenAI, loguea el raw response

---

## Entregables de esta sesión
Al terminar, confirma que:
[ ] pnpm dev levanta web en :3000 y api en :3001
[ ] POST /carbon/analyze responde correctamente con el JSON de AnalysisResult
[ ] La UI muestra el resultado con el gráfico de dona
[ ] No hay errores de TypeScript ni de ESLint
[ ] El .env.example tiene todas las variables documentadas

¡Empieza leyendo el CLAUDE.md y confirma que lo entendiste!
```

**Resultado:** Claude Code leyó el CLAUDE.md, confirmó entendimiento del contrato
y procedió a construir las 5 fases del proyecto en orden.

---

### Prompt de Corrección — Error next.config.ts

Después del primer intento de `pnpm dev`, se produjo un error de configuración:

```
Al ejecutar el comando Pnpm dev sale el siguiente error:
Error: Configuring Next.js via 'next.config.ts' is not supported.
Please replace the file with 'next.config.js' or 'next.config.mjs'.

Soluciona el error sin cambiar nada de la funcionalidad
```

**Resultado:** Se identificaron 2 bugs simultáneos:
1. Next.js 14 no soporta `next.config.ts` → renombrado a `next.config.mjs`
2. NestJS CLI buscaba `dist/main.js` pero TypeScript (sin `rootDir`) generaba
   `dist/apps/api/src/main.js` → se añadió el flag `--entryFile apps/api/src/main`

---

### System Prompt de la IA (enviado a OpenAI en cada análisis)

Este es el prompt que el `AiService` envía a GPT-4o-mini en cada solicitud de análisis:

```
Eres el motor de análisis de EcoTrack AI. Tu tarea es extraer actividades
con huella de carbono del texto del usuario y devolver EXCLUSIVAMENTE un
JSON válido con esta estructura exacta:

{
  "activities": [
    {
      "category": "transport" | "energy" | "waste" | "water" | "other",
      "description": string,
      "quantity": number,
      "unit": string,
      "co2_kg_estimate": number,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "summary": string,
  "total_co2_kg": number,
  "recommendations": [string, string, string]
}

Usa factores de emisión estándar GHG Protocol:
- Transporte (camioneta/auto): ~0.21 kg CO2/km
- Vuelo doméstico: ~0.255 kg CO2/km por pasajero
- Electricidad (Colombia): ~0.126 kg CO2/kWh
- Gas natural: ~2.0 kg CO2/m³
- Residuos orgánicos: ~0.5 kg CO2/kg
- Agua: ~0.001 kg CO2/litro

Si la cantidad es ambigua, asume el caso promedio y marca confidence
como "low". Genera exactamente 3 recomendaciones concretas y accionables.
No incluyas texto fuera del JSON. No uses markdown. Solo el objeto JSON puro.
```

**Parámetros de configuración:**
| Parámetro | Valor | Razón |
|---|---|---|
| `model` | `gpt-4o-mini` (dev) / `gpt-4o` (prod) | Balance costo/precisión |
| `temperature` | `0.2` | Respuestas consistentes y reproducibles |
| `response_format` | `{ type: "json_object" }` | Garantiza JSON válido siempre |

---

### Prompt de Ejemplo para el Usuario (chips en la UI)

Estos son los ejemplos sugeridos que aparecen como chips clickeables en la interfaz:

```
"Usamos 5 camionetas de reparto y gastamos 200 kWh de luz al día"
"3 empleados viajaron en avión a Bogotá, vuelo de 1 hora"
"Generamos 50 kg de residuos y usamos gas natural por 8 horas"
```

---

## 2. Proceso de Iteración

### Iteración 1 — Lectura del Contrato (CLAUDE.md)

**Acción:** Claude Code intentó leer CLAUDE.md con `Read` tool.
**Problema encontrado:** El archivo reportaba "1 línea" de contenido.
**Intervención del usuario:** _"CLAUDE.md no esta vacio"_
**Resolución:** Se usó `cat -n` desde Bash, revelando el archivo completo de 342 líneas.

```
Archivos leídos: CLAUDE.md (342 líneas)
Confirmación dada: Contrato entendido al 100%
```

---

### Iteración 2 — Scaffolding del Monorepo (FASE 1)

Se crearon los archivos base del monorepo en paralelo:

| Archivo | Propósito |
|---|---|
| `package.json` (raíz) | Workspace root con scripts TurboRepo |
| `pnpm-workspace.yaml` | Declaración de workspaces `apps/*` y `packages/*` |
| `turbo.json` | Pipelines: `dev`, `build`, `test`, `lint` |
| `tsconfig.base.json` | TypeScript strict compartido para todos los paquetes |
| `.prettierrc` | Formato unificado (singleQuote, tabWidth: 2) |
| `.gitignore` | Excluye `node_modules`, `.env`, `.next`, `.turbo` |
| `.env.example` | Documentación de todas las variables requeridas |

**Decisión técnica:** Se mantuvieron las convenciones exactas del CLAUDE.md sin desviaciones.

---

### Iteración 3 — packages/shared-types (FASE 2)

Se definieron primero todos los tipos compartidos, siguiendo el principio del contrato:
> *"Los tipos compartidos entre web y api viven en packages/shared-types. Importar desde ahí, nunca duplicar."*

**Tipos creados:**

```typescript
// carbon.types.ts
type CarbonCategory = 'transport' | 'energy' | 'waste' | 'water' | 'other'
type ConfidenceLevel = 'high' | 'medium' | 'low'

interface CarbonActivity { ... }   // Actividad individual detectada por IA
interface AnalysisResult { ... }   // Respuesta completa del análisis
interface EmissionFactor { ... }   // Factor de referencia GHG Protocol

// dto.types.ts
interface AnalyzeRequestDto { ... }   // Request frontend → backend
interface ApiErrorResponse { ... }    // Error estandarizado
```

---

### Iteración 4 — Backend NestJS (FASE 3)

**Módulos construidos en orden:**

```
AppModule
├── ConfigModule (global, con validación de variables de entorno)
├── AiModule
│   └── AiService → encapsula cliente OpenAI
└── CarbonModule
    ├── CarbonController → POST /carbon/analyze · GET /carbon/factors
    └── CarbonService → lógica de negocio, historial en Map
```

**Middleware global configurado:**
- `ValidationPipe` (whitelist: true, transform: true, forbidNonWhitelisted: true)
- `GlobalExceptionFilter` → respuestas de error consistentes con `ApiErrorResponse`
- `LoggingInterceptor` → log de cada request con tiempo de respuesta

**Decisión técnica clave:** Se eliminó `rootDir` del `tsconfig.json` del api para
permitir que TypeScript resuelva los imports de `../../packages/shared-types/src/`.
Esto causó el bug de la Iteración 6.

---

### Iteración 5 — Frontend Next.js (FASE 4)

**Arquitectura de la UI:**

```
app/
├── layout.tsx          → metadata SEO, Inter font, Sonner toasts
├── page.tsx            → Server Component (punto de entrada)
└── api/carbon/analyze/ → Route Handler (proxy hacia NestJS)

components/
├── MainApp.tsx         → Client Component orquestador con layout grid
├── ChatInput.tsx       → Textarea + chips de ejemplos sugeridos
├── ResultsDashboard.tsx → Panel completo de resultados
├── CarbonDonutChart.tsx → Gráfico de dona con Recharts
├── ActivityCard.tsx    → Tarjeta individual por actividad
├── RecommendationCard.tsx → Tarjeta de recomendación con ícono
└── LoadingAnalysis.tsx → Skeletons animados mientras procesa

hooks/
└── use-analysis.ts     → Estado, loading, error, toast notifications
```

**Decisión de arquitectura:** El frontend NUNCA llama directamente a OpenAI.
El Route Handler `app/api/carbon/analyze/route.ts` actúa como proxy hacia
NestJS, validando el request con Zod antes de reenviarlo.

---

### Iteración 6 — Bugs y Correcciones (FASE 5)

#### Bug #1: TypeScript `rootDir` en monorepo

**Síntoma:**
```
error TS6059: File '.../packages/shared-types/src/index.ts' is not under 'rootDir'
```

**Causa raíz:** `rootDir: "./src"` impide que TypeScript incluya archivos fuera
de `apps/api/src/`, pero los imports de `@ecotrack/shared-types` apuntan a
`../../packages/shared-types/src/`.

**Solución:** Eliminar `rootDir` del `tsconfig.json` del api. TypeScript
automáticamente usa el ancestro común de todos los archivos incluidos como raíz.

---

#### Bug #2: ESLint versión incompatible

**Síntoma:**
```
WARN: unmet peer eslint@"^7.23.0 || ^8.0.0": found 9.39.4
```

**Causa raíz:** `eslint-config-next@14.2.29` requiere ESLint v7 u v8.
Se instaló ESLint v9 por defecto.

**Solución:** Forzar ESLint v8 en `apps/web/package.json`:
```json
"eslint": "^8.57.1"
```

---

#### Bug #3: next.config.ts no soportado

**Síntoma:**
```
Error: Configuring Next.js via 'next.config.ts' is not supported.
Please replace the file with 'next.config.js' or 'next.config.mjs'.
```

**Causa raíz:** Next.js 14 no tiene soporte nativo para archivos de configuración
en TypeScript (esa feature llegó en Next.js 15).

**Solución:** Renombrar a `next.config.mjs` usando ES modules:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = { transpilePackages: [...] }
export default nextConfig
```

---

#### Bug #4: NestJS CLI no encuentra dist/main

**Síntoma:**
```
Error: Cannot find module '.../apps/api/dist/main'
```

**Causa raíz:** Al eliminar `rootDir`, TypeScript compila desde la raíz del
monorepo, generando `dist/apps/api/src/main.js` en vez de `dist/main.js`.
NestJS CLI busca `dist/main` por defecto.

**Solución:** Pasar el flag `--entryFile` al script `dev`:
```json
"dev": "nest start --watch --entryFile apps/api/src/main"
```

---

## 3. Funcionalidad de IA Implementada

### Arquitectura del Flujo de IA

```
Usuario escribe texto libre
        │
        ▼
[ChatInput] — textarea con validación Zod (10-2000 chars)
        │
        ▼
[useAnalysis hook] — POST /api/carbon/analyze (Route Handler)
        │
        ▼
[Next.js Route Handler] — valida con Zod, proxy hacia NestJS
        │
        ▼
[NestJS CarbonController] — valida DTO con class-validator
        │
        ▼
[CarbonService] — orquesta la lógica, llama al AiService
        │
        ▼
[AiService] — construye el prompt, llama a OpenAI API
        │
        ▼
[OpenAI GPT-4o-mini] — extrae actividades, calcula CO₂, genera recomendaciones
        │
        ▼
[AiService] — parsea JSON, valida estructura mínima
        │
        ▼
[CarbonService] — recalcula total, genera recomendaciones si faltan, guarda historial
        │
        ▼
[Frontend] — muestra ResultsDashboard con donut chart + actividades + recomendaciones
```

---

### Técnicas de IA Aplicadas

#### 1. Structured Output (JSON Mode)

Se usa `response_format: { type: "json_object" }` para garantizar que el modelo
siempre devuelva JSON válido, eliminando el riesgo de markdown o texto extra:

```typescript
const response = await this.client.chat.completions.create({
  model: this.model,
  response_format: { type: 'json_object' }, // ← garantiza JSON válido
  messages: [...],
  temperature: 0.2,
})
```

**Por qué funciona:** OpenAI con `json_object` mode tiene una capa de post-procesamiento
que fuerza el output a ser JSON parseable, incluso si el modelo quería añadir
texto adicional.

---

#### 2. Few-Shot Prompting Implícito con Factores GHG Protocol

El system prompt incluye los factores de emisión estándar del GHG Protocol
(Greenhouse Gas Protocol) como contexto de referencia. Esto actúa como
"few-shot prompting" implícito porque le da al modelo los valores exactos
a usar, reduciendo la alucinación de cifras:

```
Usa factores de emisión estándar GHG Protocol:
- Transporte (camioneta/auto): ~0.21 kg CO2/km
- Electricidad (Colombia): ~0.126 kg CO2/kWh
- Gas natural: ~2.0 kg CO2/m³
```

**Resultado:** El modelo no inventa sus propios factores — usa los valores
de referencia internacionalmente reconocidos.

---

#### 3. Temperatura Baja para Consistencia

Se configuró `temperature: 0.2` (escala 0-2) para lograr respuestas
deterministas y reproducibles. Una temperatura baja hace que el modelo
elija los tokens más probables en cada paso:

| Temperatura | Comportamiento |
|---|---|
| 0.0 | Completamente determinista |
| **0.2** | **Alta consistencia, poca variabilidad (usado en EcoTrack)** |
| 1.0 | Balance creatividad/consistencia |
| 2.0 | Alta aleatoriedad |

---

#### 4. Manejo de Ambigüedad con Nivel de Confianza

El sistema instruye al modelo a indicar cuándo una estimación es incierta:

```
Si la cantidad es ambigua, asume el caso promedio y
marca confidence como "low".
```

Esto se refleja en la UI con badges de color en cada `ActivityCard`:
- 🟢 **Alta confianza** — cantidad explícita en el texto
- 🟡 **Confianza media** — cantidad inferida con contexto
- ⚪ **Baja confianza** — cantidad asumida por defecto

---

#### 5. Extracción de Entidades y Cuantificación

La tarea central de la IA es **Named Entity Recognition (NER) aplicado a
emisiones de carbono**. Dado un texto como:

> *"Usamos 5 camionetas de reparto y gastamos 200 kWh de luz al día"*

El modelo debe:
1. **Identificar entidades:** `5 camionetas`, `200 kWh`
2. **Clasificar categorías:** `transport`, `energy`
3. **Inferir unidades:** `vehículos/día`, `kWh`
4. **Calcular CO₂:** `5 × promedio_km × 0.21`, `200 × 0.126`
5. **Asignar confianza:** `medium` (km/día no especificados), `high` (kWh exacto)

---

#### 6. Generación de Recomendaciones Personalizadas

El modelo genera 3 recomendaciones específicas basadas en las actividades
detectadas. El `CarbonService` también tiene un mecanismo de fallback que
genera recomendaciones programáticas si la IA no las incluye, priorizando
la categoría con mayor CO₂:

```typescript
// Fallback: identifica la categoría dominante
const topCategory = Object.entries(categoryTotals)
  .sort(([, a], [, b]) => b - a)[0]?.[0]

// Genera recomendación específica por categoría
if (topCategory === 'transport') {
  recommendations.push('Considera implementar rutas optimizadas...')
}
```

---

### Visualización de Resultados

Los datos retornados por la IA se visualizan con:

| Componente | Librería | Datos mostrados |
|---|---|---|
| `CarbonDonutChart` | Recharts PieChart | CO₂ por categoría (%) |
| `ActivityCard` | Tailwind CSS | Descripción, cantidad, confianza |
| `RecommendationCard` | Tailwind CSS | Top 3 acciones sugeridas |
| Total CO₂ | HTML/CSS | Número grande prominente en kg o t |

---

## 4. Iteraciones de Despliegue en Vercel

### Iteración 7 — Adaptación para Vercel (ambas apps)

**Contexto:** El proyecto se despliega en:
- Frontend: `https://eco-track-ai-web.vercel.app`
- Backend: `https://eco-track-ai-api.vercel.app`

**Problema:** Vercel no ejecuta servidores persistentes — solo funciones serverless. NestJS está diseñado como servidor HTTP tradicional, por lo que necesita un adaptador.

**Solución aplicada:**

Se creó `apps/api/api/index.ts` como entry point serverless que envuelve NestJS en un handler de Express compatible con Vercel:

```typescript
import 'reflect-metadata'  // ← primer import obligatorio para decoradores NestJS
import express from 'express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'

let cachedApp: Express | null = null  // cache entre invocaciones

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)
  const app = await NestFactory.create(AppModule, adapter)
  await app.init()
  cachedApp = expressApp
  return cachedApp
}

export default async function handler(req, res) {
  const app = await bootstrap()
  app(req, res)
}
```

Se creó `apps/api/vercel.json`:
```json
{
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

Se creó `apps/web/vercel.json`:
```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm build --filter=web"
}
```

**Variables de entorno requeridas:**

| App | Variable | Valor |
|---|---|---|
| `api` | `OPENAI_API_KEY` | `sk-proj-...` |
| `api` | `NODE_ENV` | `production` |
| `api` | `OPENAI_MODEL` | `gpt-4o-mini` |
| `api` | `CORS_ORIGIN` | `https://eco-track-ai-web.vercel.app` |
| `web` | `NEXT_PUBLIC_API_URL` | `https://eco-track-ai-api.vercel.app` |

---

### Iteración 8 — Bug: FUNCTION_INVOCATION_FAILED en el api

**Síntoma:**
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

**Causa raíz 1 — Faltaba `import 'reflect-metadata'`**
NestJS usa decoradores (`@Injectable`, `@Controller`, `@Module`) que dependen del polyfill `reflect-metadata`. En el `main.ts` local este import era implícito, pero el nuevo entry point serverless lo necesita explícitamente como **primer import** antes de cualquier otro módulo de NestJS.

**Causa raíz 2 — `express` no declarado en `dependencies`**
Vercel bundlea solo lo que está en `dependencies`. `express` llegaba como dependencia transitiva de `@nestjs/platform-express` pero no estaba garantizado en el bundle. Se añadió explícitamente:
```json
"express": "^4.21.2"
```

**Causa raíz 3 — Import incorrecto de express**
```typescript
// ❌ Antes
const express = require('express') as () => Express

// ✅ Después
import express from 'express'
```

---

### Iteración 9 — Bug: "API key de OpenAI no configurada" en el web

**Síntoma:**
```
POST https://eco-track-ai-web.vercel.app/api/carbon/analyze 500
Error: API key de OpenAI no configurada
```

**Contexto:** `NEXT_PUBLIC_API_URL=https://eco-track-ai-api.vercel.app` estaba correctamente configurada en Vercel.

**Causa raíz:** El Route Handler tenía la validación de `OPENAI_API_KEY` en el orden incorrecto — **antes** de verificar si había un backend NestJS disponible. Bloqueaba toda solicitud aunque nunca fuera a necesitar la key:

```typescript
// ❌ Orden incorrecto — siempre falla si OPENAI_API_KEY no está en el web
const apiKey = process.env['OPENAI_API_KEY']
if (!apiKey) return NextResponse.json({ error: '...' }, { status: 500 })

const backendUrl = process.env['NEXT_PUBLIC_API_URL']
if (backendUrl) { /* nunca llega aquí */ }
```

**Solución:** Reorganizar el flujo para evaluar el proxy primero:

```typescript
// ✅ Orden correcto
// 1. ¿Hay backend NestJS? → proxy (no necesita OPENAI_API_KEY en el web)
const backendUrl = process.env['NEXT_PUBLIC_API_URL']
if (backendUrl && !backendUrl.includes('localhost')) {
  return fetch(`${backendUrl}/carbon/analyze`, ...)
}

// 2. Solo si no hay backend → OpenAI directo → ahí sí verifica la key
const apiKey = process.env['OPENAI_API_KEY']
if (!apiKey) return NextResponse.json({ error: '...' }, { status: 500 })
```

El Route Handler también implementa **dual mode**:
- **Modo proxy**: reenvía al NestJS desplegado (producción con ambas apps)
- **Modo directo**: llama a OpenAI desde Next.js (desarrollo local o deploy solo del web)

---

## 6. Arquitectura Final del Proyecto

```
ecotrack-ai/
├── CLAUDE.md                    ← Contrato de colaboración
├── Bitacora.md                  ← Este archivo
├── turbo.json                   ← Pipeline: dev, build, test, lint
├── pnpm-workspace.yaml          ← Workspaces declarados
├── tsconfig.base.json           ← TypeScript strict compartido
├── .env.example                 ← Variables documentadas (con URLs de producción)
│
├── apps/
│   ├── web/                     ← Next.js 14 · eco-track-ai-web.vercel.app
│   │   ├── vercel.json          ← Config monorepo para Vercel
│   │   ├── app/
│   │   │   ├── layout.tsx       ← SEO metadata, fuente Inter, Toaster
│   │   │   ├── page.tsx         ← Server Component entrada
│   │   │   └── api/carbon/analyze/route.ts  ← Dual mode: proxy NestJS / OpenAI directo
│   │   ├── components/          ← 7 componentes UI
│   │   ├── hooks/use-analysis.ts ← Estado + llamadas al backend
│   │   └── lib/utils.ts         ← cn(), CATEGORY_COLORS, formatCO2
│   │
│   └── api/                     ← NestJS 10 · eco-track-ai-api.vercel.app
│       ├── vercel.json          ← Rutas serverless + builder @vercel/node
│       ├── api/
│       │   └── index.ts         ← Entry point serverless (Express adapter + cache)
│       └── src/
│           ├── main.ts          ← Bootstrap local: CORS, ValidationPipe, Filter
│           ├── app.module.ts    ← Módulo raíz + LoggingInterceptor
│           ├── ai/              ← AiService encapsula OpenAI
│           ├── carbon/          ← Controller, Service, DTOs
│           └── common/          ← Filter, Interceptor, EnvValidation
│
└── packages/
    ├── shared-types/            ← DTOs e interfaces compartidos
    │   └── src/
    │       ├── carbon.types.ts  ← CarbonActivity, AnalysisResult, etc.
    │       └── dto.types.ts     ← AnalyzeRequestDto, ApiErrorResponse
    ├── ui/                      ← Componentes UI reutilizables (base)
    └── eslint-config/           ← ESLint unificado para el monorepo
```

---

## 7. Lecciones Aprendidas

| Lección | Detalle |
|---|---|
| **TypeScript + monorepo** | Eliminar `rootDir` es la solución para que TS resuelva imports cross-package; ajustar `entryFile` en NestJS CLI para compensar el cambio en la estructura de `dist/` |
| **Next.js versioning** | La configuración `.ts` es una feature de Next.js 15+, no 14. Verificar siempre la versión exacta en la documentación |
| **ESLint en monorepos** | Cada app puede necesitar versiones distintas de ESLint según sus plugins. `eslint-config-next@14` requiere ESLint v7/v8 |
| **JSON mode de OpenAI** | `response_format: json_object` es suficiente para el MVP. Para producción, considerar usar Structured Outputs con JSON Schema explícito (GPT-4o-2024-08-06+) |
| **Temperatura baja** | 0.2 es el punto ideal para extracción de datos estructurados — suficiente variabilidad para manejar textos diversos, suficiente consistencia para cifras reproducibles |
| **NestJS en Vercel** | Vercel corre funciones serverless, no servidores persistentes. NestJS requiere un adaptador Express + cache de instancia entre invocaciones. `reflect-metadata` debe importarse primero |
| **express en dependencies** | Vercel solo bundlea `dependencies`, no transitivas. Si un paquete se usa en runtime (aunque sea dep de dep), debe declararse explícitamente |
| **Orden de validaciones en Route Handler** | Las validaciones de fallback (como `OPENAI_API_KEY`) deben ir después de la lógica principal (proxy al backend), no antes. Un check prematuro puede bloquear flujos que nunca usarían esa variable |
| **Dual mode en Route Handler** | Implementar modo proxy + modo directo permite que el mismo código funcione en desarrollo local (sin backend) y en producción (con backend desplegado), controlado por una variable de entorno |

---

*EcoTrack AI — Capstone Vibe Coding · Innovación en Nuevas Tecnologías*
