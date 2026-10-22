---
sidebar_position: 2
title: Links de Pago alojados
---

Un Link de Pago devuelve una `publicUrl` administrada por AltokePay. Tu backend crea el recurso y comparte esa URL sin modificarla.

## Implementación

1. Crea el Link con `POST /api/v1/client/payment-links`.
2. Usa un `externalId`, un `Idempotency-Key` o ambos con el mismo valor.
3. Guarda `id`, `externalId`, `status`, `expiresAt` y `publicUrl`.
4. Suscribe tu endpoint a `payment-link.started`, `payment-link.paid`, `payment-link.expired` y `payment-link.canceled`.
5. Abre o comparte `publicUrl` exactamente como fue recibida.

:::danger[No inspecciones la URL]
No extraigas su contenido, no construyas una URL a partir del ID y no registres `publicUrl` completa. La página alojada gestiona internamente la experiencia de pago.
:::

## Recuperar una creación ambigua

| Identidad utilizada | Acción |
|---|---|
| Con `externalId` | Consulta `/api/v1/client/payment-links/external/:externalId`; si responde `404`, repite el mismo `POST`. |
| Solo `Idempotency-Key` | Repite el mismo `POST` con la misma key y el mismo payload. |

Si recibes `409 IDEMPOTENCY_CONFLICT`, detén el retry: esa identidad ya está asociada con otros datos.

:::info[Flujo independiente]
Un Link de Pago no produce eventos `checkout.*`. Confírmalo con `payment-link.paid`; `payment-link.started` indica que el pagador inició el flujo y que el intento ya estaba persistido antes de mostrar el QR.
:::

Continúa con la referencia de [Links de Pago](../api/payment-links.mdx) y el [checklist de producción](./production-checklist.md).
