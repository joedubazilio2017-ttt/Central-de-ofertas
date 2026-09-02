import "./globals.css";
import AuthGate from "@/components/AuthGate";

export const metadata = {
  title: "Central de Achados",
  description: "Painel de monitoramento de promoções e revenda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-base text-white min-h-screen font-sans">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
