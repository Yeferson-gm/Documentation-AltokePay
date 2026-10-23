---
sidebar_position: 1
title: Integra AltokePay
description: Conoce los flujos públicos de AltokePay y el recorrido recomendado para integrar cobros con contratos claros.
slug: /intro
---

AltokePay ofrece una Client API para crear cobros desde tu backend.

## Qué puedes construir

- **Checkout:** representa una compra concreta y se confirma mediante un webhook firmado.
- **Link de Pago:** genera una `publicUrl` alojada por AltokePay para compartir con el pagador.

Ambos flujos usan OAuth, scopes e identidades idempotentes, pero no son intercambiables.

:::info[Client API v1]
La URL base es `https://api.altokepay.site`. Las credenciales determinan si trabajas en Sandbox o Production.
:::

:::tip[Implementación de referencia]
Consulta el [ejemplo completo de incorporación](https://github.com/Yeferson-gm/EJEMPLO-DE-INCORPORACION-DE-ALTOKEPAY) para ver OAuth, Checkouts, Links de Pago y webhooks integrados con Bun y Hono.
:::

## Recorrido recomendado

1. Completa el [inicio rápido](./quickstart.mdx).
2. Revisa [autenticación y renovación OAuth](./api/authentication.mdx).
3. Implementa [Checkouts](./api/checkouts.mdx) o [Links de Pago](./api/payment-links.mdx).
4. Si usas Checkouts, añade [webhooks firmados](./integration/webhooks.mdx).
5. Antes de desplegar, completa el [checklist de producción](./integration/production-checklist.md).

:::danger[Integra desde tu backend]
API keys, tokens y secretos webhook no deben llegar al navegador ni a una aplicación móvil.
:::
