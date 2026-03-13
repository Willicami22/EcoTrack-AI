# CLAUDE.md — EcoTrack AI · Vibe Coding Capstone

> Este archivo es el **contrato de colaboración** entre tú (Claude Code) y el proyecto.
> Léelo completo antes de tocar cualquier archivo. Actualízalo cuando cambien las decisiones de arquitectura.

---

## 🌱 Visión del Producto

**EcoTrack AI** es un MVP web que permite a dueños de pequeños negocios calcular su huella de carbono
mediante lenguaje natural. El usuario describe sus actividades del día (ej: *"usamos 3 camionetas y
gastamos 150 kWh"*) y recibe un análisis inmediato con estimaciones de CO₂ equivalente, desglosado
por categoría y acompañado de recomendaciones accionables.

**Principio de diseño:** Simplicidad radical. Si el usuario necesita más de 3 clics para obtener
su resultado, algo está mal.

---

## 🏗️ Arquitectura del Monorepo (TurboRepo)

```
ecotrack-ai/
├── CLAUDE.md                  ← estás aquí
├── turbo.json                 ← pipeline de tareas Turborepo
├── package.json               ← workspaces root
├── .env.example               ← variables de entorno compartidas (nunca commitear .env)
│
├── apps/
│   ├── web/                   ← Next.js 14 (App Router) · Puerto 3000
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       ← landing / chat principal
│   │   │   └── api/           ← Route Handlers SOLO para proxies ligeros
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │
│   └── api/                   ← NestJS · Puerto 3001
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── carbon/        ← módulo principal de cálculo
│       │   ├── ai/            ← módulo de integración con IA
│       │   └── common/        ← guards, filters, interceptors
│       └── test/
│
└── packages/
    ├── ui/                    ← componentes compartidos (shadcn/ui base)
    ├── shared-types/          ← DTOs e interfaces TypeScript compartidos
    └── eslint-config/         ← configuración ESLint unificada
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión objetivo |
|------|-----------|-----------------|
| Monorepo | **TurboRepo** | ^2.x |
| Frontend | **Next.js** (App Router) | 14.x |
| Backend | **NestJS** | 10.x |
| Lenguaje | **TypeScript** (strict) | 5.x |
| Estilos | **Tailwind CSS** + shadcn/ui | latest |
| IA / LLM | **OpenAI API** (`gpt-4o`) | — |
| Validación | **Zod** (frontend) · **class-validator** (NestJS) | — |
| Testing | **Vitest** (web) · **Jest** (api) | — |
| Package manager | **pnpm** workspaces | ^9.x |

---

## ⚙️ Comandos Esenciales

```bash
# Instalar dependencias (siempre desde la raíz)
pnpm install

# Desarrollo local (ambas apps en paralelo)
pnpm dev

# Desarrollo individual
pnpm --filter web dev
pnpm --filter api dev

# Build completo (respeta el pipeline de Turbo)
pnpm build

# Tests
pnpm test
pnpm --filter api test:e2e

# Lint y formato
pnpm lint
pnpm format

# Generar nuevo módulo NestJS
pnpm --filter api exec nest g module <nombre>
pnpm --filter api exec nest g service <nombre>
pnpm --filter api exec nest g controller <nombre>
```

---

## 📐 Convenciones de Código

### TypeScript — Reglas de Oro
- `strict: true` en todos los tsconfig. **Nunca usar `any`**; si es inevitable, justificarlo con un comentario `// @ts-expect-error — razón`.
- Preferir `interface` sobre `type` para objetos con forma fija. Usar `type` para uniones, intersecciones y aliases.
- Los tipos compartidos entre `web` y `api` viven en `packages/shared-types`. Importar desde ahí, nunca duplicar.
- Toda función asíncrona debe manejar sus errores (try/catch o `.catch()`). No dejar Promises flotando.

### NestJS (apps/api)
- Un módulo por dominio de negocio. El módulo `carbon/` y el módulo `ai/` son los principales.
- Usar **DTOs con class-validator** para toda entrada de datos. Nunca confiar en el request body sin validar.
- Los controladores solo orquestan; la lógica de negocio vive en los servicios.
- Estructura de archivos por módulo:
  ```
  carbon/
  ├── carbon.module.ts
  ├── carbon.controller.ts
  ├── carbon.service.ts
  ├── dto/
  │   ├── calculate-footprint.dto.ts
  │   └── footprint-result.dto.ts
  └── carbon.service.spec.ts
  ```
- Los endpoints siguen REST semántico: `POST /carbon/calculate`, `GET /carbon/history/:id`.
- Usar el `GlobalExceptionFilter` en `common/` para respuestas de error consistentes.

### Next.js (apps/web)
- **App Router siempre**. No usar `pages/`. 
- Los Server Components son el default. Convertir a Client Component (`"use client"`) solo cuando sea necesario (interactividad, hooks de estado).
- Los Route Handlers (`app/api/`) solo para proxies hacia el backend NestJS (evitar CORS en dev) o webhooks. No poner lógica de negocio ahí.
- Naming: componentes en `PascalCase.tsx`, hooks en `use-kebab-case.ts`, utils en `kebab-case.ts`.
- Los componentes UI reutilizables van en `packages/ui`, no en `apps/web/components`.

### Estilos
- **Tailwind utility-first**. No escribir CSS custom salvo animaciones específicas en `globals.css`.
- Paleta EcoTrack: primarios en `emerald-*` y `green-*`; neutros en `slate-*`; alertas en `amber-*`.
- Modo oscuro habilitado via `class` strategy (no `media`).
- Nunca usar `!important`. Si necesitas overridear, revisa la especificidad.

---

## 🤖 Módulo de IA — Contrato de Integración

### Dependencia a instalar
```bash
pnpm --filter api add openai
```

### Flujo principal
```
Usuario (texto libre)
    ↓  POST /carbon/analyze
NestJS AiService
    ↓  llama a OpenAI API  (gpt-4o · response_format: json_object)
    ↓  System prompt con contexto de factores de emisión
    ↓  Responde JSON estructurado
CarbonService
    ↓  valida y calcula totales
    ↓  genera recomendaciones
Frontend
    ↓  renderiza resultado con breakdown visual
```

### Configuración del cliente OpenAI (AiService)

```typescript
// apps/api/src/ai/ai.service.ts
import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
    this.model = this.config.get<string>('OPENAI_MODEL', 'gpt-4o');
  }

  async analyzeActivities(userText: string) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: 'json_object' }, // ← garantiza JSON válido
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userText },
      ],
      temperature: 0.2, // baja temperatura = respuestas más consistentes
    });

    return JSON.parse(response.choices[0].message.content!);
  }
}
```

### System Prompt Base (SYSTEM_PROMPT)
El servicio AI debe incluir este contexto en cada llamada:

```
Eres el motor de análisis de EcoTrack AI. Tu tarea es extraer actividades
con huella de carbono del texto del usuario y devolver EXCLUSIVAMENTE un
JSON válido con esta estructura:

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
  "total_co2_kg": number
}

Usa factores de emisión estándar GHG Protocol. Si la cantidad es ambigua,
asume el caso promedio y marca confidence como "low".
No incluyas texto fuera del JSON. No uses markdown. Solo el objeto JSON.
```

### Modelos recomendados por caso de uso

| Caso | Modelo | Razón |
|------|--------|-------|
| MVP / desarrollo | `gpt-4o-mini` | Más barato, suficiente para extracción de datos |
| Producción / precisión alta | `gpt-4o` | Mejor razonamiento en textos ambiguos |

> 💡 **Tip:** Empieza con `gpt-4o-mini` para no quemar créditos durante el desarrollo. Cambia a `gpt-4o` solo para demos y producción.

### Variables de Entorno Requeridas
```env
# apps/api
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=3001
NODE_ENV=development

# apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔄 Pipeline Turborepo (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

---

## 🚦 Guía de Trabajo para Claude Code

### Antes de generar código, pregúntate:
1. ¿El tipo que necesito ya existe en `packages/shared-types`?
2. ¿El componente UI que necesito ya existe en `packages/ui`?
3. ¿Estoy poniendo lógica de negocio en el lugar correcto (service, no controller)?
4. ¿Mis cambios rompen el contrato de `shared-types` que usa otra app?

### Orden de implementación sugerido
```
1. packages/shared-types  →  definir DTOs e interfaces primero
2. apps/api               →  construir endpoints y lógica
3. apps/web               →  consumir la API y construir UI
4. packages/ui            →  extraer componentes reutilizables
```

### Cuando debuggees un error:
1. Lee el stack trace completo — no adivines.
2. Verifica si el error viene del frontend, backend o la integración entre ambos.
3. Si es un error de tipos, primero revisa `packages/shared-types`.
4. Si es un error de la API de IA, loguea el raw response antes de parsear.
5. Documenta el bug y la solución en `docs/debugging-log.md`.

### Lo que NO debes hacer:
- ❌ No instales dependencias sin verificar si ya existe algo en el monorepo.
- ❌ No dupliques tipos entre `apps/web` y `apps/api`.
- ❌ No hagas llamadas directas a la API de Anthropic desde el frontend.
- ❌ No commitees archivos `.env` ni `node_modules`.
- ❌ No uses `console.log` en producción; usa el `Logger` de NestJS en el backend.

---

## 📋 Features del MVP (scope)

### ✅ Must Have (v1.0)
- [ ] Interfaz de chat para ingresar actividades en lenguaje natural
- [ ] Análisis con IA que extrae y cuantifica actividades
- [ ] Cálculo de CO₂ equivalente por categoría
- [ ] Dashboard con breakdown visual (gráfico de dona por categoría)
- [ ] Resumen con top 3 recomendaciones de reducción

### 🔜 Nice to Have (post-MVP)
- [ ] Historial de análisis por sesión
- [ ] Exportar reporte en PDF
- [ ] Comparativa con promedios del sector
- [ ] Modo multi-idioma (ES/EN)

### ❌ Out of Scope (v1.0)
- Autenticación de usuarios
- Base de datos persistente (usar estado en memoria)
- Pagos o suscripciones

---

## 📁 Documentación Relacionada

- `docs/architecture-decisions.md` — ADRs del proyecto
- `docs/debugging-log.md` — bitácora de bugs resueltos
- `docs/prompts-log.md` — registro de prompts maestros utilizados
- `docs/api-spec.md` — especificación de endpoints REST

---

*Última actualización: v1.0 — Inicialización del proyecto*
*Maintainer: EcoTrack AI Team — Capstone Vibe Coding*