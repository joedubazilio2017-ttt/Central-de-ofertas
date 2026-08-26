import "./globals.css";

export const metadata = {
  title: "Central de Achados",
  description: "Painel de monitoramento de promoções",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-base text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
