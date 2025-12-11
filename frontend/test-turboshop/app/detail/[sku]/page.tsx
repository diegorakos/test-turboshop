"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { partsAPI, Part } from "@/lib/api";
import Link from "next/link";

export default function DetailPage() {
  const params = useParams();
  const sku = params.sku as string;

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPart = async () => {
      if (!sku) return;

      try {
        setLoading(true);
        setError(null);
        const decodedSku = decodeURIComponent(sku);
        const result = await partsAPI.getPart(decodedSku);
        setPart(result);
      } catch (err) {
        console.error("Error fetching part:", err);
        setError(err instanceof Error ? err.message : "Failed to load part");
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [sku]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin">⏳</div>
        <p className="mt-4">Cargando detalles del repuesto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-bold mb-4">Error: {error}</p>
        <Link href="/catalog">
          <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors font-medium">
            Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700 font-medium mb-4">Repuesto no encontrado</p>
        <Link href="/catalog">
          <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors font-medium">
            Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/catalog">
        <button className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors font-medium">
          ← Volver al catálogo
        </button>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            {part.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={part.image}
                alt={part.name}
                className="w-full rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML =
                    '<div class="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center"><span class="text-gray-500">Sin imagen disponible</span></div>';
                }}
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 font-medium">Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{part.name}</h1>

            {part.description && (
              <p className="text-gray-700 mb-6">{part.description}</p>
            )}

            {/* Specs */}
            <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="font-bold mb-3 text-gray-900">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">SKU:</span>
                  <p className="font-semibold text-gray-900">{part.sku}</p>
                </div>
                {part.brand && (
                  <div>
                    <span className="text-gray-700 font-medium">Marca:</span>
                    <p className="font-semibold text-gray-900">{part.brand}</p>
                  </div>
                )}
                {part.model && (
                  <div>
                    <span className="text-gray-700 font-medium">Modelo:</span>
                    <p className="font-semibold text-gray-900">{part.model}</p>
                  </div>
                )}
                {part.year && (
                  <div>
                    <span className="text-gray-700 font-medium">Año:</span>
                    <p className="font-semibold text-gray-900">{part.year}</p>
                  </div>
                )}
                {part.category && (
                  <div>
                    <span className="text-gray-700 font-medium">Categoría:</span>
                    <p className="font-semibold text-gray-900">{part.category}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Best Price */}
            <div className="mb-6 bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-bold mb-2 text-gray-900">Mejor Precio</h3>
              <div className="text-4xl font-bold text-blue-700 mb-2">
                ${part.price.toFixed(2)}
              </div>
              <div
                className={`inline-block px-3 py-1 rounded font-semibold ${
                  part.stock > 0
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {part.stock > 0 ? `${part.stock} en stock` : "Sin stock"}
              </div>
            </div>
          </div>
        </div>

        {/* Provider Offers */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Ofertas por Proveedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {part.providers.map((provider) => (
              <div
                key={provider.provider}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all bg-white"
              >
                <h3 className="font-bold text-lg mb-3 text-gray-900">{provider.provider}</h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700 text-sm font-medium">Precio</span>
                    <p className="text-2xl font-bold text-blue-700">
                      ${provider.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-700 text-sm font-medium">Stock</span>
                    <p className="font-semibold text-gray-900">
                      {provider.stock > 0
                        ? `${provider.stock} unidades`
                        : "Sin stock"}
                    </p>
                  </div>

                  {provider.providerSku && (
                    <div>
                      <span className="text-gray-700 text-sm font-medium">
                        SKU Proveedor
                      </span>
                      <p className="font-mono text-xs break-all text-gray-600">
                        {provider.providerSku}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-xs">
                      Actualizado:{" "}
                      {new Date(provider.lastUpdated).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
