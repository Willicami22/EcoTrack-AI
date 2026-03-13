# 🌱 EcoTrack AI

> Calcula la huella de carbono de tu negocio en segundos, solo describiendo tus actividades en lenguaje natural.

**Demo en vivo:** [eco-track-ai-web.vercel.app](https://eco-track-ai-web.vercel.app)

---

## ¿Qué es EcoTrack AI?

EcoTrack AI es una aplicación web que permite a dueños de pequeños negocios medir su impacto ambiental sin conocimientos técnicos previos. El usuario describe sus actividades del día en texto libre y recibe al instante:

- **Estimación de CO₂** desglosada por categoría (transporte, energía, residuos, agua)
- **Gráfico de dona** con el breakdown visual por fuente de emisión
- **Top 3 recomendaciones** concretas y accionables para reducir la huella
- **Nivel de confianza** por cada actividad detectada

**Principio de diseño:** Simplicidad radical. Menos de 3 clics del texto al resultado.

---

## Demo

```
Entrada (lenguaje natural):
"Usamos 5 camionetas de reparto y gastamos 200 kWh de luz al día.
 También generamos unos 30 kg de residuos."

Salida:
  Total CO₂: 103.7 kg
  ├── 🚛 Transporte  →  78.5 kg  (75.7%)
  ├── ⚡ Energía     →  25.2 kg  (24.3%)
  └── 🗑️ Residuos   →   0.0 kg  ( 0.0%)

  Recomendaciones:
  1. Optimiza rutas de reparto para reducir km recorridos en un 20-30%
  2. Evalúa instalar paneles solares para compensar el consumo eléctrico
  3. Tu huella equivale a plantar 5 árboles para compensarla
```

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Monorepo | **TurboRepo** + pnpm workspaces | 2.x |
| Frontend | **Next.js** App Router | 14.x |
| Backend | **NestJS** | 10.x |
| Lenguaje | **TypeScript** strict | 5.x |
| Estilos | **Tailwind CSS** + paleta emerald | 3.x |
| Gráficos | **Recharts** | 2.x |
| IA / LLM | **OpenAI API** `gpt-4o-mini` / `gpt-4o` | — |
| Validación | **Zod** (web) · **class-validator** (api) | — |
| Notificaciones | **Sonner** | — |
| Deploy | **Vercel** (ambas apps) | — |

---

## Arquitectura del Monorepo

```
ecotrack-ai/
├── turbo.json                        ← pipelines: dev, build, test, lint
├── pnpm-workspace.yaml
├── tsconfig.base.json                ← TypeScript strict compartido
├── .env.example                      ← variables requeridas documentadas
│
├── apps/
│   ├── web/                          ← Next.js 14 · :3000
│   │   ├── vercel.json
│   │   ├── app/
│   │   │   ├── layout.tsx            ← SEO, fuente Inter, Toaster
│   │   │   ├── page.tsx              ← Server Component entrada
│   │   │   └── api/carbon/analyze/   ← Route Handler (proxy / OpenAI directo)
│   │   ├── components/
│   │   │   ├── MainApp.tsx           ← orquestador con layout grid
│   │   │   ├── ChatInput.tsx         ← textarea + chips de ejemplos
│   │   │   ├── ResultsDashboard.tsx  ← panel de resultados completo
│   │   │   ├── CarbonDonutChart.tsx  ← gráfico de dona Recharts
│   │   │   ├── ActivityCard.tsx      ← tarjeta por actividad detectada
│   │   │   ├── RecommendationCard.tsx
│   │   │   └── LoadingAnalysis.tsx   ← skeletons animados
│   │   ├── hooks/
│   │   │   └── use-analysis.ts       ← estado, loading, error, toasts
│   │   └── lib/utils.ts              ← cn(), colores, formatCO2()
│   │
│   └── api/                          ← NestJS 10 · :3001
│       ├── vercel.json               ← serverless adapter config
│       ├── api/index.ts              ← entry point serverless (Express adapter)
│       └── src/
│           ├── main.ts               ← bootstrap local
│           ├── app.module.ts         ← módulo raíz
│           ├── ai/
│           │   ├── ai.module.ts
│           │   └── ai.service.ts     ← cliente OpenAI + system prompt GHG
│           ├── carbon/
│           │   ├── carbon.module.ts
│           │   ├── carbon.controller.ts  ← POST /carbon/analyze · GET /carbon/factors
│           │   ├── carbon.service.ts     ← lógica + historial en memoria
│           │   └── dto/analyze-carbon.dto.ts
│           └── common/
│               ├── env.validation.ts
│               ├── global-exception.filter.ts
│               └── logging.interceptor.ts
│
└── packages/
    ├── shared-types/                 ← tipos compartidos entre web y api
    │   └── src/
    │       ├── carbon.types.ts       ← CarbonActivity, AnalysisResult, EmissionFactor
    │       └── dto.types.ts          ← AnalyzeRequestDto, ApiErrorResponse
    ├── ui/                           ← componentes reutilizables (base)
    └── eslint-config/                ← ESLint unificado
```

---

## Flujo de la IA

```
Usuario escribe texto libre
        │
        ▼
[ChatInput] — validación Zod (10–2000 chars)
        │
        ▼
[Route Handler Next.js] — proxy al backend NestJS
        │
        ▼
[CarbonController] — valida DTO con class-validator
        │
        ▼
[AiService] — construye prompt con factores GHG Protocol
        │
        ▼
[OpenAI gpt-4o-mini]
  response_format: json_object
  temperature: 0.2
        │
        ▼
[CarbonService] — recalcula total, enriquece resultado
        │
        ▼
[ResultsDashboard] — donut chart + actividades + recomendaciones
```

---

## Instalación local

### Requisitos previos

- Node.js ≥ 20
- pnpm ≥ 9
- Una API key de OpenAI ([platform.openai.com](https://platform.openai.com/api-keys))

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ecotrack-ai.git
cd ecotrack-ai

# 2. Instalar dependencias desde la raíz
pnpm install

# 3. Configurar variables de entorno
cp .env.example apps/api/.env
# Editar apps/api/.env y agregar tu OPENAI_API_KEY

# 4. Levantar ambas apps en paralelo
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

### Variables de entorno

#### `apps/api/.env`

```env
OPENAI_API_KEY=sk-proj-...      # requerida
OPENAI_MODEL=gpt-4o-mini        # gpt-4o-mini (dev) | gpt-4o (prod)
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

#### `apps/web` (solo en producción)

```env
NEXT_PUBLIC_API_URL=https://eco-track-ai-api.vercel.app
```

---

## Scripts disponibles

```bash
# Desarrollo (ambas apps en paralelo)
pnpm dev

# Build completo
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Por app individual
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter api test
```

---

## API Reference

### `POST /carbon/analyze`

Analiza texto en lenguaje natural y devuelve la huella de carbono estimada.

**Request:**
```json
{
  "text": "Usamos 5 camionetas y gastamos 200 kWh de luz",
  "businessType": "Logística"
}
```

**Response `200`:**
```json
{
  "activities": [
    {
      "category": "transport",
      "description": "5 camionetas de reparto",
      "quantity": 5,
      "unit": "vehículos/día",
      "co2_kg_estimate": 52.5,
      "confidence": "medium"
    }
  ],
  "summary": "El negocio genera principalmente emisiones por transporte.",
  "total_co2_kg": 77.7,
  "recommendations": [
    "Optimiza las rutas de reparto para reducir km recorridos.",
    "Considera vehículos eléctricos para el parque de camionetas.",
    "Tu huella equivale a plantar 4 árboles para compensarla."
  ]
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `category` | `transport` \| `energy` \| `waste` \| `water` \| `other` | Categoría GHG |
| `confidence` | `high` \| `medium` \| `low` | Nivel de certeza de la estimación |
| `total_co2_kg` | `number` | Suma total en kg CO₂ equivalente |

### `GET /carbon/factors`

Devuelve la tabla de factores de emisión de referencia (GHG Protocol).

---

## Despliegue en Vercel

El proyecto está configurado para desplegar ambas apps de forma independiente en Vercel.

### Backend (`apps/api`)

1. Importar el repositorio en Vercel
2. Configurar **Root Directory:** `apps/api`
3. Agregar variables de entorno:

| Variable | Valor |
|---|---|
| `OPENAI_API_KEY` | `sk-proj-...` |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://tu-frontend.vercel.app` |

### Frontend (`apps/web`)

1. Importar el repositorio en Vercel (segundo proyecto)
2. Configurar **Root Directory:** `apps/web`
3. Agregar variables de entorno:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend.vercel.app` |

> El Route Handler del web implementa **dual mode**: si `NEXT_PUBLIC_API_URL` apunta a un backend real, lo usa como proxy. Si no está configurada, llama a OpenAI directamente (requiere `OPENAI_API_KEY` también en el web).

---

## Factores de Emisión (GHG Protocol)

| Fuente | Factor | Unidad |
|---|---|---|
| Camioneta / auto diésel | 0.21 kg CO₂ | por km |
| Vuelo doméstico | 0.255 kg CO₂ | por km/pasajero |
| Electricidad (Colombia) | 0.126 kg CO₂ | por kWh |
| Gas natural | 2.0 kg CO₂ | por m³ |
| Residuos orgánicos | 0.5 kg CO₂ | por kg |
| Residuos mixtos | 1.0 kg CO₂ | por kg |
| Agua potable | 0.001 kg CO₂ | por litro |

---

## Decisiones de Arquitectura

- **Tipos no duplicados:** todos los tipos compartidos viven en `packages/shared-types`. Tanto `apps/web` como `apps/api` los importan desde ahí.
- **OpenAI solo en el servidor:** el frontend nunca llama directamente a OpenAI. Siempre pasa por el Route Handler (Next.js) o el controlador (NestJS).
- **Sin base de datos:** el historial de análisis se guarda en memoria (`Map`) con un máximo de 10 sesiones. Acorde al scope MVP.
- **Serverless-first:** el backend NestJS usa un adaptador Express con cache de instancia para funcionar en Vercel sin perder los beneficios del framework.

---

## Licencia

MIT — Capstone Vibe Coding · 9no Semestre · Innovación en Nuevas Tecnologías
