import type { Metadata } from "next";
import { Providers } from "./providers";
import "assets/styles/global.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Kampo",
  icons: { icon: "/jcsolutions.svg" },
};

// Tema: por defecto oscuro; aplica claro solo si el usuario lo eligió antes.
const themeScript = `try {
  if (localStorage.getItem('theme') === 'light') { document.documentElement.classList.remove('dark'); }
  else { document.documentElement.classList.add('dark'); }
} catch (e) {}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Lato:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
