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
            {part.providers.map((provider) => (
              <div
                key={provider.provider}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition-all bg-white"
              >
                <h3 className="font-bold text-lg mb-3 text-slate-900">
                  {provider.provider}
                </h3>

                {provider.stock > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-700 text-sm font-medium">Precio</span>
                      <p className="text-2xl font-bold text-teal-600">${provider.price}</p>
                    </div>

                    <div>
                      <span className="text-slate-700 text-sm font-medium">Stock</span>
                      <p className="font-semibold text-slate-900">{provider.stock} unidades</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 px-3 rounded bg-red-50 border border-red-200 flex items-center justify-center">
                    <span className="text-red-700 font-semibold">
                      Sin stock en este proveedor
                    </span>
                  </div>
                )}
              </div>
            ))}
              <div>
                <span className="text-slate-600">Stock Total:</span>
                <p className={`font-semibold ${part.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                  {part.stock > 0 ? `${part.stock} unidades` : "Sin stock"}
                </p>
              </div>
            </div>

            {/* Especificaciones */}
            <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-200">
              <h3 className="font-bold mb-3 text-slate-900">
                Especificaciones Completas
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-medium">SKU:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs">{part.sku}</code>
                </div>
                {part.brand && (
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">Marca:</span>
                    <span className="text-slate-900 font-semibold">{part.brand}</span>
                  </div>
                )}
                {part.model && (
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">Modelo del Auto:</span>
                    <span className="text-slate-900 font-semibold">{part.model}</span>
                  </div>
                )}
                {part.year && (
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">Año:</span>
                    <span className="text-slate-900 font-semibold">{part.year}</span>
                  </div>
                )}
                {part.category && (
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">Categoría:</span>
                    <span className="text-slate-900 font-semibold">{part.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Best Price */}
            <div className="mb-6 bg-teal-50 p-4 rounded border border-teal-200">
              <h3 className="font-bold mb-2 text-slate-900">Mejor Precio</h3>
              {part.stock > 0 ? (
                <>
                  <div className="text-4xl font-bold text-teal-600 mb-2">
                    ${part.price}
                  </div>
                  <div className="inline-block px-3 py-1 rounded font-semibold bg-green-100 text-green-900">
                    {part.stock} en stock
                  </div>
                </>
              ) : (
                <div className="py-4 px-3 rounded bg-red-50 border border-red-200">
                  <span className="text-red-700 font-semibold">
                    Sin stock disponible
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Provider Offers */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Ofertas por Proveedor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {part.providers.map((provider) => (
              <div
                key={provider.provider}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition-all bg-white"
              >
                <h3 className="font-bold text-lg mb-3 text-slate-900">
                  {provider.provider}
                </h3>

                {provider.stock > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-700 text-sm font-medium">
                        Precio
                      </span>
                      <p className="text-2xl font-bold text-teal-600">
                        ${provider.price}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-700 text-sm font-medium">
                        Stock
                      </span>
                      <p className="font-semibold text-slate-900">
                        {provider.stock} unidades
                      </p>
                    </div>

                    {provider.providerSku && (
                      <div>
                        <span className="text-slate-700 text-sm font-medium">
                          {/* Info */}
                          <div>
                            <h1 className="text-3xl font-bold mb-2 text-slate-900">
                              {part.name}
                            </h1>
            
                            {part.category && (
                              <p className="text-teal-600 font-semibold mb-4">
                                📦 {part.category}
                              </p>
                            )}

                            {part.description && (
                              <p className="text-slate-600 mb-6 leading-relaxed">{part.description}</p>
                            )}

                            {/* Quick Facts */}
                            <div className="mb-6 grid grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded border border-slate-200">
                              <div>
                                <span className="text-slate-600">Número de Parte:</span>
                                <p className="font-semibold text-slate-900">{part.sku}</p>
                              </div>
                              {part.brand && (
                                <div>
                                  <span className="text-slate-600">Marca:</span>
                                  <p className="font-semibold text-slate-900">{part.brand}</p>
                                </div>
                              )}
                              {part.model && (
                                <div>
                                  <span className="text-slate-600">Modelo:</span>
                                  <p className="font-semibold text-slate-900">{part.model}</p>
                                </div>
                              )}
                              {part.year && (
                                <div>
                                  <span className="text-slate-600">Año:</span>
                                  <p className="font-semibold text-slate-900">{part.year}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-600">Proveedores:</span>
                                <p className="font-semibold text-slate-900">{part.providers.length}</p>
                              </div>
                              <div>
                                <span className="text-slate-600">Stock Total:</span>
                                <p className={`font-semibold ${part.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  {part.stock > 0 ? `${part.stock} unidades` : 'Sin stock'}
                                </p>
                              </div>
                            </div>

                            {/* Specs */}
                            <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-200">
                              <h3 className="font-bold mb-3 text-slate-900">
                                Especificaciones Completas
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-700 font-medium">SKU:</span>
                                  <code className="bg-white px-2 py-1 rounded text-xs">{part.sku}</code>
                                </div>
                                {part.brand && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-medium">Marca:</span>
                                    <span className="text-slate-900 font-semibold">{part.brand}</span>
                                  </div>
                                )}
                                {part.model && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-medium">Modelo del Auto:</span>
                                    <span className="text-slate-900 font-semibold">{part.model}</span>
                                  </div>
                                )}
                                {part.year && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-medium">Año:</span>
                                    <span className="text-slate-900 font-semibold">{part.year}</span>
                                  </div>
                                )}
                                {part.category && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-medium">Categoría:</span>
                                    <span className="text-slate-900 font-semibold">{part.category}</span>
                                  </div>
                                )}
                              </div>
                            </div>
