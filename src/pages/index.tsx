import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import type {ReactNode} from 'react';

import styles from './index.module.css';

const sections = [
  {
    eyebrow: '01 · Entender',
    title: 'Arquitectura',
    description:
      'Conoce los límites de confianza, la autoridad del backend y el flujo de una confirmación de pago.',
    to: '/docs/v1/architecture',
  },
  {
    eyebrow: '02 · Construir',
    title: 'Client API',
    description: 'Integra Checkouts y Links de Pago con contratos acotados, OAuth e idempotencia.',
    to: '/docs/v1/api',
  },
  {
    eyebrow: '03 · Verificar',
    title: 'Guías de integración',
    description:
      'Implementa webhooks firmados y recuperación de estado sin exponer credenciales al navegador.',
    to: '/docs/v1/integration',
  },
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://development.altokepay.site/#website',
      url: 'https://development.altokepay.site/',
      name: 'AltokePay Developer Docs',
      description: 'Documentación pública para integrar la Client API v1 de AltokePay.',
      inLanguage: 'es-PE',
      publisher: {'@id': 'https://development.altokepay.site/#organization'},
    },
    {
      '@type': 'Organization',
      '@id': 'https://development.altokepay.site/#organization',
      name: 'AltokePay',
      url: 'https://altokepay.site/',
      logo: 'https://development.altokepay.site/img/altokepay-mark.png',
    },
  ],
};

export default function Home(): ReactNode {
  return (
    <Layout
      title="Documentación técnica"
      description="Integra la Client API v1 de AltokePay con Checkouts, Links de Pago y webhooks firmados."
    >
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <main>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.kicker}>ALTOKEPAY · DOCUMENTACIÓN</p>
            <Heading as="h1" className={styles.title}>
              Integra cobros con contratos claros.
            </Heading>
            <p className={styles.lead}>
              Referencia técnica para construir integraciones seguras con la Client API, Checkouts,
              Links de Pago y webhooks de AltokePay.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/v1/intro">
                Empezar
              </Link>
              <Link className="button button--outline button--lg" to="/docs/v1/api">
                Explorar la API
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="https://github.com/Yeferson-gm/EJEMPLO-DE-INCORPORACION-DE-ALTOKEPAY"
              >
                Ver ejemplo completo
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="documentation-path-title">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>RUTA RECOMENDADA</p>
            <Heading id="documentation-path-title" as="h2">
              De la arquitectura a producción
            </Heading>
          </div>
          <div className={styles.grid}>
            {sections.map((section) => (
              <Link className={styles.card} key={section.title} to={section.to}>
                <span className={styles.cardEyebrow}>{section.eyebrow}</span>
                <Heading as="h3">{section.title}</Heading>
                <p>{section.description}</p>
                <span className={styles.cardAction}>Abrir sección →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
