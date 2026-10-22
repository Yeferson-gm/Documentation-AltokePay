---
sidebar_position: 3
title: Scopes y entornos
---


Los scopes limitan qué puede hacer una integración. El entorno queda fijado por la API key y por los tokens derivados de ella.

## Prerrequisitos

- Un access token obtenido mediante [OAuth](./authentication.mdx).
- El conjunto mínimo de operaciones que necesita tu backend.

Base oficial: `https://api.altokepay.site`.

## Catálogo cerrado

| Scope | Autoriza |
|---|---|
| `payment-methods:read` | Consultar receptores y billeteras compatibles para Checkout. |
| `checkouts:read` | Leer un Checkout por ID o `externalId` y consultar su estado. |
| `checkouts:write` | Crear, cancelar y reintentar Checkouts. |
| `payment-links:read` | Leer un Link por ID o `externalId` y consultar su estado. |
| `payment-links:write` | Crear y cancelar Links. |

Cada API key tiene un subconjunto explícito y no vacío. Los permisos de lectura y escritura son independientes.

### Perfiles mínimos habituales

| Integración | Scopes mínimos |
|---|---|
| Checkout completo | `payment-methods:read`, `checkouts:read`, `checkouts:write` |
| Solo consulta de Checkouts | `checkouts:read` |
| Link de Pago completo | `payment-links:read`, `payment-links:write` |
| Checkouts y Links | Los cinco scopes del catálogo |

## Verificar permisos y entorno

**`GET https://api.altokepay.site/api/v1/client/auth/me`**

```bash
curl "https://api.altokepay.site/api/v1/client/auth/me" \
  --header "Authorization: Bearer $ALTOKEPAY_ACCESS_TOKEN"
```

Respuesta `200` relevante:

```json
{
  "success": true,
  "data": {
    "scopes": [
      "payment-methods:read",
      "checkouts:read",
      "checkouts:write"
    ],
    "environment": "sandbox",
    "livemode": false,
    "accessTokenExpiresAt": "2026-10-21T18:15:00.000Z"
  },
  "timestamp": "2026-10-21T18:00:01.000Z"
}
```

La respuesta completa también incluye el contexto de organización y de la API key de origen.

:::danger[Verifica el contexto al arrancar]
Compara organización, `environment`, `livemode` y scopes con tu configuración antes de crear recursos. Una key Sandbox puede parecer funcional, pero opera sobre datos aislados de Production.
:::

## Production y Sandbox

| Propiedad | Sandbox | Production |
|---|---|---|
| Prefijo API key | `ppp_sandbox_*` | `ppp_production_*` |
| `environment` | `sandbox` | `production` |
| `livemode` | `false` | `true` |
| Recursos e idempotencia | Aislados | Aislados |
| Secrets y webhooks | Aislados | Aislados |

No existe selector de entorno en headers, body o query. Usa credenciales emitidas dentro de la organización compañera correcta. La configuración publicada de receptores y métodos de cobro es canónica, pero los IDs de billeteras aceptadas y los recursos creados siguen aislados por organización.

Reducir scopes, rotar o revocar la API key invalida las familias de tokens afectadas. Tu integración debe obtener credenciales nuevas y volver a comprobar `/auth/me`.

## Errores frecuentes

| HTTP | Código | Causa habitual |
|---:|---|---|
| `401` | `UNAUTHORIZED` | Bearer vencido, revocado o derivado de una API key no válida. |
| `403` | `FORBIDDEN` | Falta el scope requerido por la operación. |
| `404` | `NOT_FOUND` | El recurso pertenece a otro tenant o entorno, o no existe. |

Consulta [respuestas y errores](./responses-errors.md) para decidir cuándo renovar o corregir la solicitud.

## Siguiente paso

- Para Checkouts, consulta [métodos de cobro](./payment-methods.md).
- Para una URL alojada, continúa con [Links de Pago](./payment-links.mdx).
