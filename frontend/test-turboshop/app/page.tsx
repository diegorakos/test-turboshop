import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Marketplace de Repuestos
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
          Encuentra los mejores repuestos de múltiples proveedores en tiempo
          real
        </p>
        <Link href="/catalog">
          <button className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors text-lg shadow-lg hover:shadow-xl">
            Explorar Catálogo
          </button>
        </Link>
      </div>
    </div>
  );
}
