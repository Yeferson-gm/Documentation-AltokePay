---
sidebar_position: 1
title: Arquitectura de integración
slug: /architecture
---

import DocCardList from '@theme/DocCardList';

AltokePay se integra desde tu backend mediante OAuth. La credencial determina la organización, los permisos y el entorno de cada solicitud.

:::danger[Solo server-side]
No envíes API keys, access tokens, refresh tokens ni secretos webhook al navegador o a una aplicación móvil.
:::

## Principios del contrato

- Usa `https://api.altokepay.site` como origen de OAuth y Client API.
- Solicita solo los scopes necesarios.
- Conserva una identidad estable antes de crear un recurso.
- Trata el estado devuelto por AltokePay como autoritativo.
- Usa webhooks para confirmar Checkouts y Links de Pago; no infieras pagos mediante relojes o consultas repetidas.
- Consume `publicUrl` literalmente para Links de Pago.

## Checkout y Link de Pago

| Necesidad | Checkout | Link de Pago |
|---|---|---|
| Experiencia | Tu ecommerce | Página alojada por AltokePay |
| Identidad | `externalId` | `externalId`, `Idempotency-Key` o ambos |
| Resultado | Webhook `checkout.*` | Webhook `payment-link.*` y estado alojado |
| Recuperación | Lectura puntual por `externalId` | Lectura por `externalId` o replay idéntico |

Son flujos distintos. Un Link de Pago no produce eventos `checkout.*`.

## Entornos

Sandbox y Production usan el mismo origen, pero credenciales y recursos separados. Verifica `environment` y `livemode` después de autenticarte y evita reutilizar identidades o secretos entre entornos.

## Seguridad

<DocCardList />
