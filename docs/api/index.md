---
sidebar_position: 1
title: Client API v1
slug: /api
---

import DocCardList from '@theme/DocCardList';

La Client API está diseñada para integraciones server-to-server. No expongas sus credenciales en el navegador.

:::info[Base URL]
```text
https://api.altokepay.site
```

Sandbox y Production usan el mismo origen. La credencial determina la organización y el entorno.
:::

## Elige un flujo

| Necesidad | Recurso | Guía |
|---|---|---|
| Confirmar una compra de ecommerce | Checkout | [Checkouts](./checkouts.mdx) y [webhooks](../integration/webhooks.mdx) |
| Compartir una página de cobro | Link de Pago | [Links de Pago](./payment-links.mdx) |

OAuth usa `/oauth/token`. Las operaciones autenticadas usan `/api/v1/client/*` con `Authorization: Bearer`.

## Convenciones

- Requests y responses usan JSON en `camelCase`.
- Fechas usan ISO 8601.
- Los campos opcionales sin valor se omiten.
- Los montos usan unidades mayores: `42.5` PEN representa `S/ 42.50`.
- Cada respuesta incluye un `requestId` útil para soporte.

## Referencia

<DocCardList />

## Primeros pasos

1. [Intercambia tu API key por OAuth](./authentication.mdx).
2. Verifica organización, entorno y [scopes](./scopes-environments.md).
3. Persiste la identidad idempotente antes de crear recursos.
4. Valida el [envelope y los errores](./responses-errors.md).

También puedes seguir el [inicio rápido](../quickstart.mdx).
