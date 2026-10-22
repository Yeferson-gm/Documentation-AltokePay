# AltokePay Documentation — Agent entry point

Cuando este paquete esté dentro de la monorepo AltokePay, lee primero `../AGENTS.md`, `../ROLE.md`, `../SYSTEM.md`, `../MEMORY.md` y `../docs/README.md`. En el repositorio público independiente, comienza por este archivo y `README.md`; las referencias internas de la monorepo no forman parte de la publicación.

## Ownership

Este paquete posee el sitio público de documentación construido con Docusaurus. No reemplaza automáticamente la documentación interna de arquitectura, seguridad, procesos u operación que pertenece al root, Backend, Admin o POS.

## Reglas

- Usa Bun para instalar, validar y construir.
- Biome posee el formato y lint; no añadas ESLint ni Prettier.
- Ejecuta `bun run int:check` antes de entregar cambios.
- Mantén las versiones `@docusaurus/*` alineadas exactamente.
- No publiques secretos, URLs con capabilities, credenciales ni datos de tenants.
- No documentes como público un endpoint que no pertenezca al contrato externo.
- Conserva separados Checkout, Payment Link, Admin, POS y Client API.
- No copies documentación interna de forma masiva; migra por propietario y elimina duplicación únicamente cuando el nuevo documento sea autoritativo.
- Todo cambio de navegación debe pasar `bun run typecheck` y `bun run build`.
- Las URLs de producción se configuran con `DOCUSAURUS_URL` y `DOCUSAURUS_BASE_URL`; no inventes destinos de despliegue.
