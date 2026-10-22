import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import type {ReactNode} from 'react';

type ExampleSet = Readonly<{
  curl: string;
  typescript: string;
  php: string;
  python: string;
  java: string;
}>;

type CodeExamplesProps = Readonly<{
  examples: ExampleSet;
  title: string;
}>;

function CodeExamples({examples, title}: CodeExamplesProps): ReactNode {
  return (
    <Tabs groupId="api-language" queryString="language">
      <TabItem value="curl" label="cURL" default>
        <CodeBlock language="bash" title={title}>
          {examples.curl}
        </CodeBlock>
      </TabItem>
      <TabItem value="typescript" label="TypeScript · Bun">
        <CodeBlock language="typescript" title={title}>
          {examples.typescript}
        </CodeBlock>
      </TabItem>
      <TabItem value="php" label="PHP">
        <CodeBlock language="php" title={title}>
          {examples.php}
        </CodeBlock>
      </TabItem>
      <TabItem value="python" label="Python">
        <CodeBlock language="python" title={title}>
          {examples.python}
        </CodeBlock>
      </TabItem>
      <TabItem value="java" label="Java">
        <CodeBlock language="java" title={title}>
          {examples.java}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

const tokenExchangeExamples: ExampleSet = {
  curl: `: "\${ALTOKEPAY_API_KEY:?Define ALTOKEPAY_API_KEY}"

curl --request POST "https://api.altokepay.site/oauth/token" \\
  --fail-with-body --show-error --silent \\
  --connect-timeout 5 --max-time 10 \\
  --header "Content-Type: application/json" \\
  --data '{"grantType":"apiKey","apiKey":"'"$ALTOKEPAY_API_KEY"'"}'`,
  typescript: `const apiKey = Bun.env.ALTOKEPAY_API_KEY;
if (!apiKey) throw new Error("Define ALTOKEPAY_API_KEY");

const response = await fetch("https://api.altokepay.site/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    grantType: "apiKey",
    apiKey,
  }),
  signal: AbortSignal.timeout(10_000),
});

const envelope: unknown = await response.json();
if (typeof envelope !== "object" || envelope === null) {
  throw new Error("AltokePay devolvió JSON inesperado");
}
const result = envelope as Record<string, unknown>;
if (
  !response.ok ||
  result.success !== true ||
  typeof result.data !== "object" ||
  result.data === null
) {
  throw new Error(
    "AltokePay " + response.status + ": " +
      String(result.code ?? "UNKNOWN") + " (" +
      String(result.requestId ?? "sin requestId") + ")",
  );
}
const data = result.data as Record<string, unknown>;
if (
  typeof data.accessToken !== "string" ||
  typeof data.refreshToken !== "string" ||
  typeof data.environment !== "string"
) {
  throw new Error("AltokePay devolvió tokens inesperados");
}`,
  php: `<?php
declare(strict_types=1);

function requiredEnv(string $name): string
{
    $value = getenv($name);
    if ($value === false || trim($value) === '') {
        throw new RuntimeException("Define {$name}");
    }
    return $value;
}

$body = json_encode([
    'grantType' => 'apiKey',
    'apiKey' => requiredEnv('ALTOKEPAY_API_KEY'),
], JSON_THROW_ON_ERROR);
$curl = curl_init('https://api.altokepay.site/oauth/token');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);
$response = curl_exec($curl);
if ($response === false) {
    $message = curl_error($curl);
    curl_close($curl);
    throw new RuntimeException("No se pudo conectar con AltokePay: {$message}");
}
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
$envelope = json_decode($response, true, flags: JSON_THROW_ON_ERROR);
if (!is_array($envelope) || $status !== 200 || ($envelope['success'] ?? false) !== true) {
    $code = is_array($envelope) ? ($envelope['code'] ?? 'UNKNOWN') : 'INVALID_RESPONSE';
    $requestId = is_array($envelope) ? ($envelope['requestId'] ?? 'sin requestId') : 'sin requestId';
    throw new RuntimeException("AltokePay {$status}: {$code} ({$requestId})");
}
$data = $envelope['data'];
if (
    !is_array($data)
    || !is_string($data['accessToken'] ?? null)
    || !is_string($data['refreshToken'] ?? null)
    || !is_string($data['environment'] ?? null)
) {
    throw new RuntimeException('AltokePay devolvió tokens inesperados');
}`,
  python: `import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen

body = json.dumps({
    "grantType": "apiKey",
    "apiKey": os.environ["ALTOKEPAY_API_KEY"],
}).encode()
request = Request(
    "https://api.altokepay.site/oauth/token",
    data=body,
    headers={"Content-Type": "application/json"},
    method="POST",
)
try:
    with urlopen(request, timeout=10) as response:
        if response.status != 200:
            raise RuntimeError(f"AltokePay respondió {response.status}")
        envelope = json.load(response)
except HTTPError as error:
    with error:
        envelope = json.load(error)
    raise RuntimeError(
        f"AltokePay {error.code}: {envelope.get('code', 'UNKNOWN')} "
        f"({envelope.get('requestId', 'sin requestId')})"
    ) from error
if not isinstance(envelope, dict) or envelope.get("success") is not True:
    raise RuntimeError("AltokePay devolvió un envelope inesperado")
if not isinstance(envelope.get("data"), dict):
    raise RuntimeError("AltokePay devolvió datos inesperados")
data = envelope["data"]
if not all(isinstance(data.get(field), str) for field in (
    "accessToken", "refreshToken", "environment"
)):
    raise RuntimeError("AltokePay devolvió tokens inesperados")`,
  java: `import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

public final class TokenExchangeExample {
  public static void main(String[] args) throws Exception {
    var apiKey = System.getenv("ALTOKEPAY_API_KEY");
    if (apiKey == null || apiKey.isBlank()) {
      throw new IllegalStateException("Define ALTOKEPAY_API_KEY");
    }

    var mapper = new ObjectMapper();
    var body = mapper.writeValueAsString(Map.of(
        "grantType", "apiKey",
        "apiKey", apiKey));
    var client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();
    var request = HttpRequest.newBuilder(
        URI.create("https://api.altokepay.site/oauth/token"))
        .timeout(Duration.ofSeconds(10))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    var envelope = mapper.readTree(response.body());
    if (response.statusCode() != 200 || !envelope.path("success").asBoolean()) {
      throw new IllegalStateException(
          "AltokePay " + response.statusCode() + ": "
              + envelope.path("code").asText("UNKNOWN") + " ("
              + envelope.path("requestId").asText("sin requestId") + ")");
    }

    var data = envelope.required("data");
    data.required("accessToken");
    data.required("refreshToken");
    data.required("environment");
    System.out.println(data);
  }
}`,
};

const checkoutCreateExamples: ExampleSet = {
  curl: `: "\${ALTOKEPAY_ACCESS_TOKEN:?Define ALTOKEPAY_ACCESS_TOKEN}"

curl --request POST "https://api.altokepay.site/api/v1/client/checkouts" \\
  --fail-with-body --show-error --silent \\
  --connect-timeout 5 --max-time 10 \\
  --header "Authorization: Bearer $ALTOKEPAY_ACCESS_TOKEN" \\
  --header "Content-Type: application/json" \\
  --data '{
    "externalId":"order-2026-0001",
    "providerCode":"yape",
    "acceptedWalletId":"8ef7b701-0d40-4cf9-b45f-706e34314d8c",
    "amount":42.50,
    "currency":"PEN",
    "payerName":"María Quispe"
  }'`,
  typescript: `const accessToken = Bun.env.ALTOKEPAY_ACCESS_TOKEN;
if (!accessToken) throw new Error("Define ALTOKEPAY_ACCESS_TOKEN");

const response = await fetch("https://api.altokepay.site/api/v1/client/checkouts", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    externalId: "order-2026-0001",
    providerCode: "yape",
    acceptedWalletId: "8ef7b701-0d40-4cf9-b45f-706e34314d8c",
    amount: 42.5,
    currency: "PEN",
    payerName: "María Quispe",
  }),
  signal: AbortSignal.timeout(10_000),
});

const parsed: unknown = await response.json();
if (typeof parsed !== "object" || parsed === null) {
  throw new Error("AltokePay devolvió JSON inesperado");
}
const envelope = parsed as Record<string, unknown>;
if (
  ![200, 201].includes(response.status) ||
  envelope.success !== true ||
  typeof envelope.data !== "object" ||
  envelope.data === null
) {
  throw new Error(
    "AltokePay " + response.status + ": " +
      String(envelope.code ?? "UNKNOWN") + " (" +
      String(envelope.requestId ?? "sin requestId") + ")",
  );
}
const checkout = envelope.data as Record<string, unknown>;
if (
  typeof checkout.id !== "string" ||
  typeof checkout.externalId !== "string" ||
  typeof checkout.status !== "string"
) {
  throw new Error("AltokePay devolvió un Checkout inesperado");
}`,
  php: `<?php
declare(strict_types=1);

$body = json_encode([
    'externalId' => 'order-2026-0001',
    'providerCode' => 'yape',
    'acceptedWalletId' => '8ef7b701-0d40-4cf9-b45f-706e34314d8c',
    'amount' => 42.50,
    'currency' => 'PEN',
    'payerName' => 'María Quispe',
], JSON_THROW_ON_ERROR);
$accessToken = getenv('ALTOKEPAY_ACCESS_TOKEN');
if ($accessToken === false || trim($accessToken) === '') {
    throw new RuntimeException('Define ALTOKEPAY_ACCESS_TOKEN');
}
$curl = curl_init('https://api.altokepay.site/api/v1/client/checkouts');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);
$response = curl_exec($curl);
if ($response === false) {
    $message = curl_error($curl);
    curl_close($curl);
    throw new RuntimeException("No se pudo conectar con AltokePay: {$message}");
}
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
$envelope = json_decode($response, true, flags: JSON_THROW_ON_ERROR);
if (
    !is_array($envelope)
    || !in_array($status, [200, 201], true)
    || ($envelope['success'] ?? false) !== true
    || !array_key_exists('data', $envelope)
) {
    $code = is_array($envelope) ? ($envelope['code'] ?? 'UNKNOWN') : 'INVALID_RESPONSE';
    $requestId = is_array($envelope) ? ($envelope['requestId'] ?? 'sin requestId') : 'sin requestId';
    throw new RuntimeException("AltokePay {$status}: {$code} ({$requestId})");
}
$checkout = $envelope['data'];
if (
    !is_array($checkout)
    || !is_string($checkout['id'] ?? null)
    || !is_string($checkout['externalId'] ?? null)
    || !is_string($checkout['status'] ?? null)
) {
    throw new RuntimeException('AltokePay devolvió un Checkout inesperado');
}`,
  python: `import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen

body = json.dumps({
    "externalId": "order-2026-0001",
    "providerCode": "yape",
    "acceptedWalletId": "8ef7b701-0d40-4cf9-b45f-706e34314d8c",
    "amount": 42.50,
    "currency": "PEN",
    "payerName": "María Quispe",
}).encode()
request = Request(
    "https://api.altokepay.site/api/v1/client/checkouts",
    data=body,
    headers={
        "Authorization": f'Bearer {os.environ["ALTOKEPAY_ACCESS_TOKEN"]}',
        "Content-Type": "application/json",
    },
    method="POST",
)
try:
    with urlopen(request, timeout=10) as response:
        if response.status not in (200, 201):
            raise RuntimeError(f"AltokePay respondió {response.status}")
        envelope = json.load(response)
except HTTPError as error:
    with error:
        envelope = json.load(error)
    raise RuntimeError(
        f"AltokePay {error.code}: {envelope.get('code', 'UNKNOWN')}"
    ) from error
if not isinstance(envelope, dict) or envelope.get("success") is not True:
    raise RuntimeError("AltokePay devolvió un envelope inesperado")
if not isinstance(envelope.get("data"), dict):
    raise RuntimeError("AltokePay devolvió datos inesperados")
checkout = envelope["data"]
if not all(isinstance(checkout.get(field), str) for field in (
    "id", "externalId", "status"
)):
    raise RuntimeError("AltokePay devolvió un Checkout inesperado")`,
  java: `import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

public final class CheckoutCreateExample {
  public static void main(String[] args) throws Exception {
    var token = System.getenv("ALTOKEPAY_ACCESS_TOKEN");
    if (token == null || token.isBlank()) {
      throw new IllegalStateException("Define ALTOKEPAY_ACCESS_TOKEN");
    }

    var mapper = new ObjectMapper();
    var body = mapper.writeValueAsString(Map.of(
        "externalId", "order-2026-0001",
        "providerCode", "yape",
        "acceptedWalletId", "8ef7b701-0d40-4cf9-b45f-706e34314d8c",
        "amount", 42.50,
        "currency", "PEN",
        "payerName", "María Quispe"));
    var client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();
    var request = HttpRequest.newBuilder(
        URI.create("https://api.altokepay.site/api/v1/client/checkouts"))
        .timeout(Duration.ofSeconds(10))
        .header("Authorization", "Bearer " + token)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    var envelope = mapper.readTree(response.body());
    if ((response.statusCode() != 200 && response.statusCode() != 201)
        || !envelope.path("success").asBoolean()) {
      throw new IllegalStateException(
          "AltokePay " + response.statusCode() + ": "
              + envelope.path("code").asText("UNKNOWN") + " ("
              + envelope.path("requestId").asText("sin requestId") + ")");
    }

    var checkout = envelope.required("data");
    checkout.required("id");
    checkout.required("externalId");
    checkout.required("status");
    System.out.println(checkout);
  }
}`,
};

const paymentLinkCreateExamples: ExampleSet = {
  curl: `: "\${ALTOKEPAY_ACCESS_TOKEN:?Define ALTOKEPAY_ACCESS_TOKEN}"

curl --request POST "https://api.altokepay.site/api/v1/client/payment-links" \\
  --fail-with-body --show-error --silent \\
  --connect-timeout 5 --max-time 10 \\
  --header "Authorization: Bearer $ALTOKEPAY_ACCESS_TOKEN" \\
  --header "Content-Type: application/json" \\
  --header "Idempotency-Key: link-order-2026-0001" \\
  --data '{
    "externalId":"link-order-2026-0001",
    "amount":42.50,
    "message":"Pedido 2026-0001",
    "expirationMinutes":30,
    "payerIdentityType":"name",
    "payerName":"María Quispe"
  }'`,
  typescript: `const accessToken = Bun.env.ALTOKEPAY_ACCESS_TOKEN;
if (!accessToken) throw new Error("Define ALTOKEPAY_ACCESS_TOKEN");

const idempotencyKey = "link-order-2026-0001";
const response = await fetch("https://api.altokepay.site/api/v1/client/payment-links", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  },
  body: JSON.stringify({
    externalId: idempotencyKey,
    amount: 42.5,
    message: "Pedido 2026-0001",
    expirationMinutes: 30,
    payerIdentityType: "name",
    payerName: "María Quispe",
  }),
  signal: AbortSignal.timeout(10_000),
});

const parsed: unknown = await response.json();
if (typeof parsed !== "object" || parsed === null) {
  throw new Error("AltokePay devolvió JSON inesperado");
}
const envelope = parsed as Record<string, unknown>;
if (
  ![200, 201].includes(response.status) ||
  envelope.success !== true ||
  typeof envelope.data !== "object" ||
  envelope.data === null
) {
  throw new Error(
    "AltokePay " + response.status + ": " +
      String(envelope.code ?? "UNKNOWN") + " (" +
      String(envelope.requestId ?? "sin requestId") + ")",
  );
}
const paymentLink = envelope.data as Record<string, unknown>;
if (
  typeof paymentLink.id !== "string" ||
  typeof paymentLink.publicUrl !== "string" ||
  typeof paymentLink.status !== "string"
) {
  throw new Error("AltokePay devolvió un Link inesperado");
}`,
  php: `<?php
declare(strict_types=1);

$idempotencyKey = 'link-order-2026-0001';
$body = json_encode([
    'externalId' => $idempotencyKey,
    'amount' => 42.50,
    'message' => 'Pedido 2026-0001',
    'expirationMinutes' => 30,
    'payerIdentityType' => 'name',
    'payerName' => 'María Quispe',
], JSON_THROW_ON_ERROR);
$accessToken = getenv('ALTOKEPAY_ACCESS_TOKEN');
if ($accessToken === false || trim($accessToken) === '') {
    throw new RuntimeException('Define ALTOKEPAY_ACCESS_TOKEN');
}
$curl = curl_init('https://api.altokepay.site/api/v1/client/payment-links');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
        "Idempotency-Key: {$idempotencyKey}",
    ],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);
$response = curl_exec($curl);
if ($response === false) {
    $message = curl_error($curl);
    curl_close($curl);
    throw new RuntimeException("No se pudo conectar con AltokePay: {$message}");
}
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
$envelope = json_decode($response, true, flags: JSON_THROW_ON_ERROR);
if (
    !is_array($envelope)
    || !in_array($status, [200, 201], true)
    || ($envelope['success'] ?? false) !== true
    || !array_key_exists('data', $envelope)
) {
    $code = is_array($envelope) ? ($envelope['code'] ?? 'UNKNOWN') : 'INVALID_RESPONSE';
    $requestId = is_array($envelope) ? ($envelope['requestId'] ?? 'sin requestId') : 'sin requestId';
    throw new RuntimeException("AltokePay {$status}: {$code} ({$requestId})");
}
$paymentLink = $envelope['data'];
if (
    !is_array($paymentLink)
    || !is_string($paymentLink['id'] ?? null)
    || !is_string($paymentLink['publicUrl'] ?? null)
    || !is_string($paymentLink['status'] ?? null)
) {
    throw new RuntimeException('AltokePay devolvió un Link inesperado');
}`,
  python: `import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen

key = "link-order-2026-0001"
body = json.dumps({
    "externalId": key,
    "amount": 42.50,
    "message": "Pedido 2026-0001",
    "expirationMinutes": 30,
    "payerIdentityType": "name",
    "payerName": "María Quispe",
}).encode()
request = Request(
    "https://api.altokepay.site/api/v1/client/payment-links",
    data=body,
    headers={
        "Authorization": f'Bearer {os.environ["ALTOKEPAY_ACCESS_TOKEN"]}',
        "Content-Type": "application/json",
        "Idempotency-Key": key,
    },
    method="POST",
)
try:
    with urlopen(request, timeout=10) as response:
        if response.status not in (200, 201):
            raise RuntimeError(f"AltokePay respondió {response.status}")
        envelope = json.load(response)
except HTTPError as error:
    with error:
        envelope = json.load(error)
    raise RuntimeError(
        f"AltokePay {error.code}: {envelope.get('code', 'UNKNOWN')}"
    ) from error
if not isinstance(envelope, dict) or envelope.get("success") is not True:
    raise RuntimeError("AltokePay devolvió un envelope inesperado")
if not isinstance(envelope.get("data"), dict):
    raise RuntimeError("AltokePay devolvió datos inesperados")
payment_link = envelope["data"]
if not all(isinstance(payment_link.get(field), str) for field in (
    "id", "publicUrl", "status"
)):
    raise RuntimeError("AltokePay devolvió un Link inesperado")`,
  java: `import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

public final class PaymentLinkCreateExample {
  public static void main(String[] args) throws Exception {
    var token = System.getenv("ALTOKEPAY_ACCESS_TOKEN");
    if (token == null || token.isBlank()) {
      throw new IllegalStateException("Define ALTOKEPAY_ACCESS_TOKEN");
    }
    var key = "link-order-2026-0001";
    var mapper = new ObjectMapper();
    var body = mapper.writeValueAsString(Map.of(
        "externalId", key,
        "amount", 42.50,
        "message", "Pedido 2026-0001",
        "expirationMinutes", 30,
        "payerIdentityType", "name",
        "payerName", "María Quispe"));
    var client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();
    var request = HttpRequest.newBuilder(
        URI.create("https://api.altokepay.site/api/v1/client/payment-links"))
        .timeout(Duration.ofSeconds(10))
        .header("Authorization", "Bearer " + token)
        .header("Content-Type", "application/json")
        .header("Idempotency-Key", key)
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    var envelope = mapper.readTree(response.body());
    if ((response.statusCode() != 200 && response.statusCode() != 201)
        || !envelope.path("success").asBoolean()) {
      throw new IllegalStateException(
          "AltokePay " + response.statusCode() + ": "
              + envelope.path("code").asText("UNKNOWN") + " ("
              + envelope.path("requestId").asText("sin requestId") + ")");
    }

    var paymentLink = envelope.required("data");
    paymentLink.required("id");
    paymentLink.required("publicUrl");
    paymentLink.required("status");
    System.out.println(paymentLink);
  }
}`,
};

const webhookVerificationExamples: ExampleSet = {
  curl: `: "\${ALTOKEPAY_WEBHOOK_URL:?Define ALTOKEPAY_WEBHOOK_URL}"
: "\${ALTOKEPAY_WEBHOOK_TIMESTAMP:?Define ALTOKEPAY_WEBHOOK_TIMESTAMP}"
: "\${ALTOKEPAY_WEBHOOK_SIGNATURE:?Define ALTOKEPAY_WEBHOOK_SIGNATURE}"

curl --request POST "$ALTOKEPAY_WEBHOOK_URL" \
  --fail-with-body --show-error --silent \
  --connect-timeout 5 --max-time 10 \
  --header "Content-Type: application/json" \
  --header "X-AltokePay-Webhook-Id: wh_example_01" \
  --header "X-AltokePay-Delivery-Id: dlv_example_01" \
  --header "X-AltokePay-Event-Id: 3f42c9d8-d274-4cec-b9a6-f08d686d23a1" \
  --header "X-AltokePay-Environment: sandbox" \
  --header "X-AltokePay-Timestamp: $ALTOKEPAY_WEBHOOK_TIMESTAMP" \
  --header "X-AltokePay-Signature: $ALTOKEPAY_WEBHOOK_SIGNATURE" \
  --header "X-AltokePay-Attempt: 1" \
  --data-binary @event.json`,
  typescript: `import {timingSafeEqual} from "node:crypto";

const secret = Bun.env.ALTOKEPAY_WEBHOOK_SECRET;
if (!secret) throw new Error("Define ALTOKEPAY_WEBHOOK_SECRET");

function verifyWebhook(rawBody: Uint8Array, timestamp: string, signature: string) {
  if (!/^\\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const timestampSeconds = Number(timestamp);
  if (!Number.isSafeInteger(timestampSeconds)) return false;
  if (Math.abs(Date.now() / 1000 - timestampSeconds) > 300) return false;

  const expected = new Bun.CryptoHasher("sha256", secret)
    .update(timestamp)
    .update(".")
    .update(rawBody)
    .digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}`,
  php: `<?php
declare(strict_types=1);

function verifyWebhook(
    string $rawBody,
    string $timestamp,
    string $signature,
    string $secret,
): bool {
    if ($secret === '') {
        throw new RuntimeException('Falta ALTOKEPAY_WEBHOOK_SECRET');
    }
    if (!ctype_digit($timestamp) || !preg_match('/^[a-f0-9]{64}$/i', $signature)) {
        return false;
    }
    if (abs(time() - (int) $timestamp) > 300) return false;

    $expected = hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);
    return hash_equals($expected, strtolower($signature));
}`,
  python: `import hashlib
import hmac
import os
import re
import time


def verify_webhook(raw_body: bytes, timestamp: str, signature: str) -> bool:
    if not timestamp.isdigit() or re.fullmatch(r"[0-9a-fA-F]{64}", signature) is None:
        return False
    if abs(time.time() - int(timestamp)) > 300:
        return False

    message = timestamp.encode() + b"." + raw_body
    expected = hmac.new(
        os.environ["ALTOKEPAY_WEBHOOK_SECRET"].encode(),
        message,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature.lower())`,
  java: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public final class WebhookVerificationExample {
  static boolean verifyWebhook(
      byte[] rawBody,
      String timestamp,
      String signature,
      byte[] secret
  ) throws Exception {
    if (secret.length == 0) throw new IllegalStateException("Falta el secreto webhook");
    if (!timestamp.matches("\\\\d+") || !signature.matches("(?i)[a-f0-9]{64}")) return false;

    final long timestampSeconds;
    try {
      timestampSeconds = Long.parseLong(timestamp);
    } catch (NumberFormatException error) {
      return false;
    }
    if (Math.abs(Instant.now().getEpochSecond() - timestampSeconds) > 300) return false;

    var mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret, "HmacSHA256"));
    mac.update((timestamp + ".").getBytes(StandardCharsets.UTF_8));
    var expected = mac.doFinal(rawBody);
    var received = HexFormat.of().parseHex(signature);
    return MessageDigest.isEqual(expected, received);
  }
}`,
};

export function TokenExchangeExample(): ReactNode {
  return <CodeExamples examples={tokenExchangeExamples} title="Intercambiar una API key" />;
}

export function CheckoutCreateExample(): ReactNode {
  return <CodeExamples examples={checkoutCreateExamples} title="Crear un Checkout" />;
}

export function PaymentLinkCreateExample(): ReactNode {
  return <CodeExamples examples={paymentLinkCreateExamples} title="Crear un Link de Pago" />;
}

export function WebhookVerificationExample(): ReactNode {
  return <CodeExamples examples={webhookVerificationExamples} title="Verificar un webhook" />;
}
