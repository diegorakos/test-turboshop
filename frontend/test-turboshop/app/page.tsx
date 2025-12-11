import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Marketplace de Repuestos
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Encuentra los mejores repuestos de múltiples proveedores en tiempo
          real
        </p>
        <Link href="/catalog">
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Explorar Catálogo
          </button>
        </Link>
      </div>
    </div>
  );
}
