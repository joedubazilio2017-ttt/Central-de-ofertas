import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Central de Achados",
  description: "Painel de monitoramento de promoções e revenda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-base text-white min-h-screen font-sans">
        <nav className="border-b border-line">
          <div className="max-w-5xl mx-auto px-4 flex gap-4 text-sm">
            <Link
              href="/"
              className="py-3 text-white/60 hover:text-white transition"
            >
              🔍 Ofertas
            </Link>
            <Link
              href="/estoque"
              className="py-3 text-white/60 hover:text-white transition"
            >
              📦 Revenda
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
