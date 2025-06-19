'use client';

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Users } from 'lucide-react';
import { AvailabilityItem } from '@/types/roomType';

export default function AvailabilityResult() {
  const availability = useSelector(
    (state: RootState) => state.properties.availability
  );
  const [selectedRateIndex, setSelectedRateIndex] = useState<
    Record<string, number>
  >({});
  const [selectedPax, setSelectedPax] = useState<Record<string, number>>({});

  const grouped = useMemo(() => {
    const map = new Map<string, AvailabilityItem[]>();
    availability.forEach((item) => {
      const group = map.get(item.room_type) || [];
      group.push(item);
      map.set(item.room_type, group);
    });
    return Array.from(map.entries());
  }, [availability]);

  const handleReserve = (roomType: string, rateIndex: number, pax: number) => {
    console.log('Reservar →', { roomType, rateIndex, pax });
  };

  return (
    <div className="space-y-6 mt-6">
      {grouped.map(([roomType, items]) => {
        // Rates array for this roomType
        const rates = items[0].rates;
        const ratesCount = rates.length;
        const maxPax = Math.max(
          ...rates.flatMap((r) => r.prices.map((p) => p.occupancy))
        );

        // Selected guests (default to 1)
        const pax = selectedPax[roomType] ?? 1;

        // Calculate total price for each rate by summing over dates
        const rateTotals = Array.from({ length: ratesCount }).map((_, idx) =>
          items.reduce((sum, item) => {
            const priceObj = item.rates[idx].prices.find(
              (p) => p.occupancy === pax
            );
            return sum + (priceObj?.price || 0);
          }, 0)
        );

        // Default selected index: cheapest rate
        const defaultIndex = rateTotals.indexOf(Math.min(...rateTotals));
        const selectedIndex = selectedRateIndex[roomType] ?? defaultIndex;
        const total = rateTotals[selectedIndex];

        return (
          <div
            key={roomType}
            className="border border-gray-300 dark:border-white/10 rounded-2xl bg-[var(--background)] shadow-sm overflow-hidden transition-colors"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
              {/* Left side: selectors */}
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dozegray/10 transition-colors">
                <h3 className="text-lg font-semibold text-dozeblue mb-2">
                  {roomType}
                </h3>
                <p className="text-sm text-[var(--foreground)] flex items-center gap-1 mb-3">
                  <Users size={16} className="text-dozeblue" /> Hasta {maxPax}{' '}
                  huésped{maxPax > 1 ? 'es' : ''}
                </p>

                {/* Rate selector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    Habitación
                  </label>
                  <select
                    value={selectedIndex}
                    onChange={(e) =>
                      setSelectedRateIndex((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-dozeblue bg-white dark:bg-dozegray/10 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-dozeblue"
                  >
                    {rateTotals.map((sumPrice, idx) => (
                      <option key={idx} value={idx}>
                        Habitación {idx + 1} – Total ${sumPrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pax selector */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Huéspedes
                  </label>
                  <select
                    value={pax}
                    onChange={(e) =>
                      setSelectedPax((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-dozeblue bg-white dark:bg-dozegray/10 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-dozeblue"
                  >
                    {Array.from({ length: maxPax }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n} huésped{n > 1 ? 'es' : ''}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Right side: prices and button */}
              <div className="p-6 flex flex-col justify-between gap-4 transition-colors">
                <div className="space-y-3">
                  {/* Individual prices badges */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    {rates[selectedIndex].prices.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-dozeblue/30 border border-dozeblue text-xs font-medium"
                      >
                        {p.occupancy} pax: ${p.price}
                      </span>
                    ))}
                  </div>

                  {/* Benefits badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      'Desayuno incluido',
                      'Pago en el alojamiento',
                      'Cancelación gratis',
                    ].map((label, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reservation button and total */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-sm text-[var(--foreground)]">
                  <span>
                    {Array(pax).fill('👤').join(' ')} – 1 habitación
                    seleccionada – <strong>Total ${total}</strong>
                  </span>
                  <button
                    onClick={() => handleReserve(roomType, selectedIndex, pax)}
                    className="bg-dozeblue text-white font-medium px-5 py-2.5 rounded-lg hover:bg-dozeblue/90"
                  >
                    Reservar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
