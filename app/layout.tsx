import type { Metadata } from "next";
import "./theme.css";
import './palettes.css';
import './corporate.css';
import './appearance.css';
import ThemePicker from './theme-picker';
import { themeInitialization } from '../lib/themes';

export const metadata: Metadata = {
  title: "CARDNET | Centro de operaciones",
  description: "Un ecosistema conectado para administrar servicios, empresas y operaciones.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitialization }} /></head>
      <body className="antialiased">{children}<ThemePicker /></body>
    </html>
  );
}
