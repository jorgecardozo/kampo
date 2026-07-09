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
          Por defecto OSCURO; aplica claro solo si el usuario lo eligió antes. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try {
            if (localStorage.getItem('theme') === 'light') {
              document.documentElement.classList.remove('dark');
            } else {
              document.documentElement.classList.add('dark');
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
