---
sidebar_position: 7
title: Respuestas y errores
---

Evalúa el status HTTP y el envelope JSON antes de usar `data` o decidir un retry.

## Éxito

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  requestId?: string;
  timestamp: string;
}
```

```json
{
  "success": true,
  "data": {
    "id": "a2fc0915-f6ec-4b2d-9fd1-4470b138b145",
    "status": "awaiting_payment"
  },
  "requestId": "req_xxxxxxxxxxxxxxxxxxxx",
  "timestamp": "2026-10-21T18:00:00.000Z"
}
```

Los campos opcionales sin valor se omiten; no asumas que aparecerán como `null`.

## Error

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}
```

```json
{
  "success": false,
  "error": "La solicitud contiene campos inválidos",
  "code": "BAD_REQUEST",
  "requestId": "req_xxxxxxxxxxxxxxxxxxxx",
  "timestamp": "2026-10-21T18:00:00.000Z"
}
```

Conserva `requestId`, status, operación y hora para soporte. No registres credenciales, `publicUrl` completas ni payloads sensibles.

## Qué hacer según la respuesta

| Condición | Acción |
|---|---|
| Timeout o conexión interrumpida | Recupera el recurso antes de repetir una creación |
| `400` / `422` | Corrige la solicitud; no repitas el mismo payload |
| `401 UNAUTHORIZED` | Renueva OAuth una vez o revisa la credencial |
| `403 FORBIDDEN` | Añade el scope requerido |
| `404 NOT_FOUND` | Verifica recurso, organización y entorno |
| `409 IDEMPOTENCY_CONFLICT` | Detén el retry; la identidad representa otros datos |
| `409 CONFLICT` | Lee el estado actual y corrige la operación |
| `429 TOO_MANY_REQUESTS` | Reintenta con backoff acotado |
| `5xx` | Conserva identidad y payload; recupera primero si era una creación |

:::warning[Un timeout no equivale a fallo]
No generes un `externalId` o `Idempotency-Key` nuevo. Sigue la recuperación específica de [Checkouts](./checkouts.mdx) o [Links de Pago](./payment-links.mdx).
:::

## Validación mínima

1. Comprueba que el body sea JSON con forma de objeto.
2. Valida el status esperado.
3. Exige `success: true` y `data` en respuestas exitosas.
4. Conserva `code` y `requestId` en errores.
5. Valida los campos requeridos antes de persistir efectos.

Los montos usan unidades mayores y aceptan como máximo dos decimales.
