# AltokePay Documentation

Portal público de arquitectura, Client API e integración de AltokePay, construido con Docusaurus 3.10.2 y publicado como documentación v1.

- Sitio: <https://development.altokepay.site>
- Repositorio: <https://github.com/Yeferson-gm/Documentation-AltokePay>

## Requisitos

- Bun 1.4 o posterior.
- Node.js 20 o posterior, requerido por Docusaurus.

## Desarrollo local

```bash
bun install
bun start
```

El servidor de desarrollo abre `http://localhost:3000`. La URL canónica predeterminada del build es `https://development.altokepay.site`.

## Comandos

| Comando | Propósito |
|---|---|
| `bun start` | Inicia el servidor de desarrollo. |
| `bun run format` | Formatea archivos compatibles con Biome. |
| `bun run format:check` | Comprueba el formato sin modificar archivos. |
| `bun run lint` | Ejecuta las reglas estáticas de Biome. |
| `bun run check` | Comprueba formato, lint y acciones de código. |
| `bun run typecheck` | Valida TypeScript y componentes TSX. |
| `bun run build` | Valida MDX, rutas y enlaces y genera `build/`. |
| `bun run int:check` | Ejecuta Biome, TypeScript y el build completo. |
| `bun run deploy:cloudflare:dry-run` | Valida y prepara el despliegue sin publicarlo. |
| `bun run deploy:cloudflare` | Valida y publica en Cloudflare Workers Static Assets. |
| `bun run serve` | Sirve localmente el build generado. |
| `bun run clear` | Elimina cachés generadas por Docusaurus. |

## Configuración de despliegue

| Variable | Predeterminado | Propósito |
|---|---|---|
| `DOCUSAURUS_URL` | `https://development.altokepay.site` | Origen canónico HTTPS. |
| `DOCUSAURUS_BASE_URL` | `/` | Prefijo de publicación; debe comenzar y terminar con `/`. |

El buscador local se genera durante `bun run build`, aparece en el header y funciona sin credenciales ni servicios externos. Indexa documentación y páginas con acceso rápido mediante `Ctrl/Cmd+K`.

La base de la Client API no es configurable en este paquete: el contrato público usa `https://api.altokepay.site`.

## SEO y descubrimiento por agentes

Docusaurus genera canonical, Open Graph, Twitter Cards y `sitemap.xml` desde el origen canónico. La portada añade JSON-LD conservador de `WebSite` y `Organization`, sin ratings, métricas ni relaciones comerciales inventadas.

Los archivos estáticos de descubrimiento son:

- `/robots.txt`: permite la documentación, excluye resultados internos de búsqueda y anuncia el sitemap index;
- `/sitemap.xml`: generado por el plugin oficial de Docusaurus, sin `priority` ni `changefreq` arbitrarios;
- `/sitemap-index.xml`: referencia estable para herramientas que esperan un índice;
- `/llms.txt`: recorrido público y conciso para agentes, separado de robots y sitemap.

Estos archivos solo enlazan contratos públicos bajo `/docs/v1/*`. No deben incluir rutas internas, secretos, endpoints Admin, capacidades de pago ni detalles de infraestructura.

## Cloudflare Workers

La documentación se publica como activos estáticos, sin un Worker de aplicación. `wrangler.jsonc` define:

- Worker: `altokepay-documentation`;
- directorio publicado: `build/`;
- ruta de zona: `development.altokepay.site/*`.

Antes de desplegar, autentica Wrangler de forma interactiva con `bunx wrangler login` o configura `CLOUDFLARE_API_TOKEN` en el entorno seguro del operador o de CI. Nunca guardes el token en el repositorio, archivos `.env`, documentación ni historial de comandos.

```bash
bun install --frozen-lockfile
bun run deploy:cloudflare:dry-run
bun run deploy:cloudflare
```

La ruta de Worker reutiliza el registro DNS proxied existente y su certificado TLS. El hostname debe permanecer bajo la zona `altokepay.site`; no elimines ni reemplaces registros de otros servicios.

Para revertir, vuelve a desplegar una revisión conocida y validada del repositorio o restaura una versión anterior desde el historial de despliegues de Cloudflare. Después verifica la portada, `/docs/v1/api/checkouts` y `/docs/v1/integration/webhooks`.

## Versión documental

Docusaurus trata `docs/` como la versión activa **v1** mediante `lastVersion: "current"`. La documentación se publica bajo `/docs/v1/*` y el navbar muestra el selector oficial `docsVersionDropdown` como **v1**. Mientras no exista v2 se mantiene una sola carpeta autoritativa, evitando duplicación entre `docs/` y `versioned_docs/`.

## Contenido

- `docs/intro.md`: entrada y recorrido recomendado.
- `docs/quickstart.mdx`: inicio server-side.
- `docs/architecture/`: autoridad, fronteras y seguridad.
- `docs/api/`: OAuth, scopes, métodos de cobro, seis operaciones Checkout, cinco operaciones Payment Link, envelopes, errores, dinero e idempotencia.
- `docs/integration/`: patrón, flujo alojado, webhooks firmados y checklist Production.
- `src/components/ApiExamples/`: ejemplos sincronizados en cURL, TypeScript, PHP, Python y Java.

## Autoridad documental

Este portal posee el contrato público para integradores. Los documentos de Backend siguen poseyendo detalles internos y deben cambiar en el mismo trabajo cuando el contrato público cambie. Runbooks, decisiones, seguridad interna y operación no se copian al portal público.

## Validación obligatoria

```bash
bun run int:check
```

Docusaurus se configura con `onBrokenLinks: "throw"`; enlaces, slugs o imports MDX inválidos bloquean el build.
