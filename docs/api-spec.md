# EcoTrack AI — API Specification

Base URL: `http://localhost:3001`

---

## POST /carbon/analyze

Analiza texto en lenguaje natural y devuelve la huella de carbono estimada.

**Request Body:**
```json
{
  "text": "Usamos 5 camionetas de reparto y gastamos 200 kWh de luz",
  "businessType": "Logística" // opcional
}
```

**Response 200:**
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
    },
    {
      "category": "energy",
      "description": "Consumo eléctrico",
      "quantity": 200,
      "unit": "kWh",
      "co2_kg_estimate": 25.2,
      "confidence": "high"
    }
  ],
  "summary": "El negocio genera 77.7 kg de CO₂ principalmente por transporte.",
  "total_co2_kg": 77.7,
  "recommendations": [
    "Optimiza las rutas de reparto para reducir km recorridos.",
    "Considera vehículos eléctricos para el parque de camionetas.",
    "Tu huella equivale a plantar 4 árboles para compensarla."
  ]
}
```

**Errores:**
- `400` — Texto inválido (muy corto, muy largo)
- `502` — Error al conectar con OpenAI

---

## GET /carbon/factors

Devuelve la tabla de factores de emisión de referencia.

**Response 200:**
```json
[
  {
    "category": "transport",
    "name": "Camioneta / auto diésel",
    "factor_kg_per_unit": 0.21,
    "unit": "km",
    "source": "GHG Protocol"
  }
]
```
