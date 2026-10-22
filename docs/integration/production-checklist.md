---
sidebar_position: 4
title: Checklist de producción
---

Completa el flujo en Sandbox antes de habilitar credenciales Production.

## Credenciales

- [ ] API key, tokens y secretos están almacenados server-side.
- [ ] El proceso falla si falta una credencial requerida.
- [ ] `/api/v1/client/auth/me` confirma scopes, `environment` y `livemode`.
- [ ] La renovación OAuth persiste el nuevo par de tokens.
- [ ] Logs y analytics excluyen credenciales y `publicUrl` completas.

## Solicitudes

- [ ] Todas las llamadas usan `https://api.altokepay.site` con timeouts.
- [ ] El status HTTP y el envelope se validan antes de usar `data`.
- [ ] Cada creación usa una identidad idempotente persistida previamente.
- [ ] Un timeout o `5xx` se recupera sin cambiar identidad ni payload.
- [ ] La integración no usa polling para confirmar pagos.

## Links de Pago

- [ ] `publicUrl` se consume literalmente y no se reconstruye.
- [ ] La integración no espera eventos `checkout.*` para Links de Pago.
- [ ] El endpoint procesa `payment-link.started` y confirma el cobro solo con `payment-link.paid`.

## Webhooks

- [ ] El endpoint usa HTTPS y conserva el raw body.
- [ ] La firma y el timestamp se validan antes de parsear el evento.
- [ ] Entorno, tipo, recurso, monto y moneda coinciden con la orden o Link local.
- [ ] `X-AltokePay-Event-Id` se deduplica de forma durable.
- [ ] El endpoint responde `2xx` después de persistir el resultado.
- [ ] Una entrega duplicada no repite efectos de negocio.

:::warning[No habilites Production]
No avances si una credencial llega al cliente, una creación puede repetirse con una identidad nueva o una orden se confirma sin verificar el webhook.
:::
