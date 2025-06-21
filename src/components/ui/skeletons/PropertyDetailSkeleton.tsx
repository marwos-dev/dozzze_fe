'use client';

import React from 'react';

export default function PropertyDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse space-y-6">
      {/* Banner principal */}
      <div className="relative w-full h-[240px] md:h-[320px] bg-gray-300 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end space-y-2">
          <div className="w-2/3 h-6 bg-gray-100/60 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-100/50 rounded"></div>
          <div className="w-5/6 h-3 bg-gray-100/40 rounded"></div>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="flex flex-col md:flex-row md:justify-center items-stretch md:items-center gap-4 md:gap-6 max-w-4xl mx-auto">
        {/* Calendario */}
        <div className="w-full md:w-[250px] h-12 bg-gray-300 dark:bg-dozegray/20 rounded-md"></div>

        {/* Huéspedes */}
        <div className="w-full md:w-[220px] h-12 bg-gray-300 dark:bg-dozegray/20 rounded-md"></div>

        {/* Botón */}
        <div className="w-full md:w-[140px] h-12 bg-gray-300 dark:bg-dozegray/20 rounded-md"></div>
      </div>

      {/* Resultado de disponibilidad */}
      <div className="space-y-4">
        {/* Repetir bloques para simular habitaciones */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-300/20 dark:bg-dozegray/20 p-4 rounded-xl space-y-3"
          >
            <div className="w-1/2 h-5 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-12 h-4 bg-gray-300 rounded"></div>
              <div className="w-8 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300 rounded"></div>
              <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="w-32 h-10 bg-gray-300 rounded mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
