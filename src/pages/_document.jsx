import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => (
  <Html>
    <Head>
      {/* <link rel="shortcut icon" href="/favicon-32.png" /> */}
      <link rel="shortcut icon" href="/jcsolutions.svg" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Lato:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      {/* Tema: por defecto claro; aplica oscuro solo si el usuario lo eligió antes.
          (No usamos prefers-color-scheme para que el default sea siempre claro.) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try {
            if (localStorage.getItem('theme') === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}`,
        }}
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
