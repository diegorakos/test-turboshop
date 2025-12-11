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
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Link href="/catalog">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Repuesto no encontrado</p>
        <Link href="/catalog">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/catalog">
        <button className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          ← Volver al catálogo
        </button>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            {part.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={part.image}
                alt={part.name}
                className="w-full rounded-lg border"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{part.name}</h1>

            {part.description && (
              <p className="text-gray-700 mb-6">{part.description}</p>
            )}

            {/* Specs */}
            <div className="mb-6 bg-gray-50 p-4 rounded">
              <h3 className="font-bold mb-3">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">SKU:</span>
                  <p className="font-semibold">{part.sku}</p>
                </div>
                {part.brand && (
                  <div>
                    <span className="text-gray-600">Marca:</span>
                    <p className="font-semibold">{part.brand}</p>
                  </div>
                )}
                {part.model && (
                  <div>
                    <span className="text-gray-600">Modelo:</span>
                    <p className="font-semibold">{part.model}</p>
                  </div>
                )}
                {part.year && (
                  <div>
                    <span className="text-gray-600">Año:</span>
                    <p className="font-semibold">{part.year}</p>
                  </div>
                )}
                {part.category && (
                  <div>
                    <span className="text-gray-600">Categoría:</span>
                    <p className="font-semibold">{part.category}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Best Price */}
            <div className="mb-6 bg-blue-50 p-4 rounded">
              <h3 className="font-bold mb-2">Mejor Precio</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ${part.price.toFixed(2)}
              </div>
              <div
                className={`inline-block px-3 py-1 rounded font-semibold ${
                  part.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {part.stock > 0 ? `${part.stock} en stock` : "Sin stock"}
              </div>
            </div>
          </div>
        </div>

        {/* Provider Offers */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Ofertas por Proveedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {part.providers.map((provider) => (
              <div
                key={provider.provider}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-3">{provider.provider}</h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Precio</span>
                    <p className="text-2xl font-bold text-blue-600">
                      ${provider.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">Stock</span>
                    <p className="font-semibold">
                      {provider.stock > 0
                        ? `${provider.stock} unidades`
                        : "Sin stock"}
                    </p>
                  </div>

                  {provider.providerSku && (
                    <div>
                      <span className="text-gray-600 text-sm">
                        SKU Proveedor
                      </span>
                      <p className="font-mono text-xs break-all">
                        {provider.providerSku}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t">
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
