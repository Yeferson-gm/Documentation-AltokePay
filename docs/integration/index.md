---
sidebar_position: 1
title: Patrón de integración
description: Implementa Checkouts y Links de Pago desde tu backend con idempotencia, timeouts y webhooks firmados.
slug: /integration
---

import DocCardList from '@theme/DocCardList';

Integra la Client API desde tu backend con credenciales del entorno correcto, scopes mínimos y timeouts.

:::tip[Código de referencia]
Usa el [repositorio de incorporación de AltokePay](https://github.com/Yeferson-gm/EJEMPLO-DE-INCORPORACION-DE-ALTOKEPAY) como implementación complementaria a esta guía.
:::

## Checkout

1. Obtén un access token.
2. Consulta los métodos de cobro disponibles.
3. Persiste tu orden y un `externalId` estable.
4. Crea el Checkout y guarda su respuesta.
5. Verifica `checkout.paid` antes de confirmar la orden.

:::important[Confirmación]
No confirmes una orden por un reloj local ni mediante polling. Procesa el webhook de forma idempotente.
:::

## Identidad del pagador

| Si tienes… | Envía… |
|---|---|
| DNI peruano de ocho dígitos | `payerDni` en Checkout o la variante `payerIdentityType: "dni"` en Link de Pago |
| Nombre completo mostrado por la billetera | `payerName` en Checkout o la variante `payerIdentityType: "name"` en Link de Pago |

Envía una sola variante. Si el proveedor DNI no está disponible, puedes reintentar la solicitud idéntica o crear una intención local nueva con nombre directo y nuevas identidades idempotentes. Nunca cambies DNI, nombre o modalidad bajo un `externalId` o `Idempotency-Key` ya utilizado.

## Link de Pago

1. Persiste una identidad estable.
2. Crea el Link con `externalId`, `Idempotency-Key` o ambos.
3. Guarda el recurso y comparte `publicUrl` sin modificarla.

Un Link de Pago usa la experiencia alojada y no produce eventos `checkout.*`.

## Resultado desconocido

Un timeout no demuestra que la creación falló.

- **Checkout:** consulta una vez por `externalId`; si responde `404`, repite el mismo `POST`.
- **Link con `externalId`:** consulta una vez por `externalId`; si responde `404`, repite el mismo `POST`.
- **Link solo con `Idempotency-Key`:** repite el mismo `POST` con la misma key y payload.

Nunca generes una identidad nueva para recuperar una solicitud ambigua. Un `409 IDEMPOTENCY_CONFLICT` exige detener el retry y revisar los datos locales.

## Guías

<DocCardList />
