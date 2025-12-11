"use client";

import { useEffect, useState } from "react";
import { partsAPI, CatalogResponse } from "@/lib/api";
import Link from "next/link";

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    carBrand: "",
    carModel: "",
    carYear: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await partsAPI.getCatalog(page, 20, debouncedSearch, {
          carBrand: filters.carBrand || undefined,
          carModel: filters.carModel || undefined,
          carYear: filters.carYear ? parseInt(filters.carYear) : undefined,
        });

        setCatalog(result);
      } catch (err) {
        console.error("Error fetching catalog:", err);
        setError(err instanceof Error ? err.message : "Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [page, debouncedSearch, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        Catálogo de Repuestos
      </h1>

      {/* Search and Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Buscar repuestos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400"
          />

          <input
            type="text"
            placeholder="Marca del Auto"
            value={filters.carBrand}
            onChange={(e) => handleFilterChange("carBrand", e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400"
          />

          <input
            type="text"
            placeholder="Modelo del Auto"
            value={filters.carModel}
            onChange={(e) => handleFilterChange("carModel", e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400"
          />

          <input
            type="number"
            placeholder="Año del Auto"
            value={filters.carYear}
            onChange={(e) => handleFilterChange("carYear", e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400"
          />

          <button
            onClick={() => {
              setSearch("");
              setFilters({ carBrand: "", carModel: "", carYear: "" });
              setPage(1);
            }}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-5xl">⚙️</div>
          <p className="mt-4 text-slate-700 font-medium text-lg">
            Cargando catálogo...
          </p>
        </div>
      )}

      {/* Results Info */}
      {!loading && catalog && (
        <div className="mb-4 text-lg text-slate-700 font-medium">
          Mostrando {catalog.parts.length} de {catalog.total} repuestos
        </div>
      )}

      {/* Parts Grid */}
      {!loading && catalog && catalog.parts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {catalog.parts.map((part) => (
            <Link
              key={part.sku}
              href={`/detail/${encodeURIComponent(part.sku)}`}
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer h-full flex flex-col">
                <div className="w-full h-48 bg-slate-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                  {part.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML =
                          '<span class="text-gray-400 text-sm">Sin imagen</span>';
                      }}
                    />
                  ) : (
                    <span className="text-slate-400 text-sm">
                      Sin imagen disponible
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  {part.name}
                </h3>
                {part.description && (
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {part.description}
                  </p>
                )}
                <div className="mt-auto">
                  {part.stock > 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-teal-600">
                          ${part.price}
                        </span>
                        <span className="px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-900">
                          {part.stock} en stock
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {part.providers.length} ofertas disponibles
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-3 px-3 rounded bg-red-50 border border-red-200">
                      <span className="text-red-700 font-semibold">
                        Sin stock disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && catalog && catalog.parts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-700 mb-4 font-medium">
            No se encontraron repuestos que coincidan con tu búsqueda
          </p>
          <button
            onClick={() => {
              setSearch("");
              setFilters({ carBrand: "", carModel: "", carYear: "" });
              setPage(1);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium"
          >
            Volver al catálogo completo
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && catalog && catalog.total > 0 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors font-medium"
          >
            ← Anterior
          </button>

          <span className="text-sm text-slate-700 font-medium">
            Página {page} de {Math.ceil(catalog.total / catalog.limit)}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!catalog.hasMore}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors font-medium"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
