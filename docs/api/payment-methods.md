---
sidebar_position: 4
title: Métodos de cobro para Checkout
description: Consulta proveedores y billeteras receptoras compatibles antes de crear un Checkout en AltokePay.
---


Consulta este catálogo antes de crear un Checkout. Devuelve únicamente receptores habilitados que tienen QR y al menos una billetera de origen compatible.

## Prerrequisitos

- Access token del entorno correcto.
- Scope `payment-methods:read`.

Base oficial: `https://api.altokepay.site`.

## Endpoint

**`GET https://api.altokepay.site/api/v1/client/payment-methods/checkout`**

```bash
curl "https://api.altokepay.site/api/v1/client/payment-methods/checkout" \
  --header "Authorization: Bearer $ALTOKEPAY_ACCESS_TOKEN"
```

## Respuesta

Respuesta `200` representativa:

```json
{
  "success": true,
  "data": [
    {
      "providerCode": "yape",
      "displayName": "Yape",
      "iconUrl": "https://api.altokepay.site/api/v1/public/payment-method-icons/yape",
      "currencies": ["PEN"],
      "checkoutAsset": {
        "secureUrl": "https://cdn.example.com/checkout-qr.webp"
      },
      "acceptedWallets": [
        {
          "id": "8ef7b701-0d40-4cf9-b45f-706e34314d8c",
          "code": "ligo",
          "name": "Ligo",
          "iconUrl": "https://api.altokepay.site/api/v1/public/payment-method-icons/ligo",
          "createdAt": "2026-10-21T18:00:00.000Z"
        }
      ],
      "matchingModes": ["expected_sender"]
    }
  ],
  "requestId": "req_xxxxxxxxxxxxxxxxxxxx",
  "timestamp": "2026-10-21T18:00:00.000Z"
}
```

Una colección vacía significa que no existe un receptor publicable para ese entorno; no intentes crear un Checkout con valores almacenados anteriormente.

## Campos

| Campo | Uso al crear el Checkout |
|---|---|
| `providerCode` | Receptor seleccionado; envíalo como `providerCode`. |
| `displayName` | Etiqueta del receptor para tu interfaz. |
| `iconUrl` | Icono absoluto servido por AltokePay. |
| `currencies` | Monedas aceptadas por el receptor. |
| `checkoutAsset.secureUrl` | QR autoritativo del receptor. |
| `acceptedWallets[].id` | Billetera de origen; envíala como `acceptedWalletId`. |
| `acceptedWallets[].code` | Código informativo de la billetera. |
| `matchingModes` | Modos de asociación disponibles; actualmente `expected_sender`. |

:::info[Catálogo autoritativo]
No inventes IDs ni mantengas un catálogo local alternativo. Production y Sandbox pueden compartir habilitación, pero los IDs de `acceptedWallets` pertenecen al tenant resuelto por el bearer.
:::

## Errores frecuentes

| HTTP | Código | Acción |
|---:|---|---|
| `401` | `UNAUTHORIZED` | Renueva el access token. |
| `403` | `FORBIDDEN` | Añade `payment-methods:read` a la API key. |
| `429` | `TOO_MANY_REQUESTS` | Aplica backoff acotado. |
| `503` | `SERVICE_UNAVAILABLE` | Reintenta la lectura con backoff acotado. |

## Siguiente paso

Usa el `providerCode` y `acceptedWallets[].id` seleccionados para [crear un Checkout](./checkouts.mdx).
