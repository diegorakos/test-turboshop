import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace de Repuestos",
  description:
    "Encuentra los mejores repuestos de múltiples proveedores en tiempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* Header Navigation */}
        <nav className="bg-white shadow border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-2xl font-bold text-blue-700">🚗</div>
                <h1 className="text-xl font-bold text-gray-900">
                  Marketplace de Repuestos
                </h1>
              </div>
            </Link>

            <div className="flex gap-6">
              <Link href="/">
                <button className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Inicio
                </button>
              </Link>
              <Link href="/catalog">
                <button className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Catálogo
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50/50">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-100 py-8 mt-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-3">Sobre nosotros</h3>
                <p className="text-gray-300 text-sm">
                  Unificamos catálogos de múltiples proveedores para ofrecerte
                  los mejores precios de repuestos.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3">Enlaces Rápidos</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>
                    <Link href="/catalog" className="hover:text-white">
                      Catálogo
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Información</h3>
                <p className="text-gray-300 text-sm">
                  Agregamos datos de proveedores en tiempo real para ofrecerte
                  información actualizada.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
              <p>
                © 2024 Marketplace de Repuestos. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
