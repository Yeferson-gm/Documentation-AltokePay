---
sidebar_position: 2
title: Seguridad de la integración
description: Protege credenciales, valida webhooks y aplica idempotencia al integrar AltokePay desde tu backend.
---

Aplica estos controles en tu backend antes de usar Production.

## Credenciales

- Guarda API keys, tokens y secretos webhook en un secret manager.
- Falla al arrancar si una credencial requerida está ausente o vacía.
- Solicita los scopes mínimos.
- Nunca registres headers de autorización, refresh tokens, secretos ni `publicUrl` completas.
- Rota cualquier credencial que pueda haberse expuesto.

## Solicitudes a la API

- Usa HTTPS y timeouts de conexión y respuesta.
- Valida el status HTTP y el envelope antes de usar `data`.
- Conserva `requestId` para soporte sin registrar contenido sensible.
- Persiste `externalId` o `Idempotency-Key` antes de crear recursos.
- Ante un timeout o `5xx`, recupera el recurso con la misma identidad; no generes otra.

## Links de Pago

`publicUrl` permite abrir la experiencia alojada. Úsala exactamente como fue recibida:

- no extraigas ni reconstruyas su contenido;
- no la uses como identidad de tu orden;
- no la incluyas completa en logs o analytics.

## Webhooks

Antes de procesar un evento:

1. verifica la firma sobre el raw body;
2. rechaza timestamps fuera de la ventana permitida;
3. valida el entorno y los campos de tu orden;
4. deduplica `X-AltokePay-Event-Id`;
5. responde `2xx` después de persistir el resultado.

Consulta [Webhooks firmados](../integration/webhooks.mdx) para la fórmula y ejemplos por lenguaje.
