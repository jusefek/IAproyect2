import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>KROMO — Tu memoria viva</title>
        <meta name="description" content="KROMO: tu diario personal con IA. Captura quién eres hoy para tu yo del futuro." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Caveat:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

