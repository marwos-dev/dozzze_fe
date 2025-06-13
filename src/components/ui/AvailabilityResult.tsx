'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CheckCircle, Users, BadgeDollarSign } from 'lucide-react';

interface Props {
  guests: number;
}

const AvailabilityResult: React.FC<Props> = () => {
  const availability = useSelector(
    (state: RootState) => state.properties.availability
  );

  const [selected, setSelected] = useState<{
    [key: string]: { rateIdx: number; occupancy: number } | null;
  }>({});

  if (!availability.length) return null;

  return (
    <div className="space-y-6 pt-6">
      {availability.map((day) => {
        const key = `${day.date}-${day.room_type}`;
        const isAvailable = day.availability > 0;
        const selectedRate = selected[key];

        return (
          <div
            key={key}
            className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-dozebg1 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-base font-semibold text-dozeblue">
                  {day.room_type}
                </h3>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-[var(--foreground)]">
                Disponibles:{' '}
                <strong className="text-dozeblue">{day.availability}</strong>
              </p>
            </div>

            {/* Habitaciones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {day.rates.map((rate, rateIdx) => {
                const maxPax = Math.max(...rate.prices.map((p) => p.occupancy));
                const skey = key;
                const isSelected = selectedRate?.rateIdx === rateIdx;
                const currentOccupancy = isSelected
                  ? (selectedRate?.occupancy ?? 1)
                  : 1;

                const price = rate.prices.find(
                  (p) => p.occupancy === currentOccupancy
                );
                const defaultPrice = rate.prices.find((p) => p.occupancy === 1);

                return (
                  <div
                    key={rateIdx}
                    onClick={() =>
                      setSelected((prev) => {
                        if (prev[skey]?.rateIdx === rateIdx) {
                          return { ...prev, [skey]: null };
                        }
                        return {
                          ...prev,
                          [skey]: { rateIdx, occupancy: 1 },
                        };
                      })
                    }
                    className={`border rounded-md p-3 transition cursor-pointer ${
                      isSelected
                        ? 'border-dozeblue bg-dozeblue/5'
                        : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-dozegray/10'
                    }`}
                  >
                    {/* Header descriptivo */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-[var(--foreground)] space-y-0.5">
                        <p className="font-semibold">Tipo {rateIdx + 1}</p>
                        <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Users size={12} className="mr-1" />
                          Hasta {maxPax} pax
                        </p>
                        <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <BadgeDollarSign size={12} className="mr-1" />
                          Desde {defaultPrice ? `$${defaultPrice.price}` : '--'}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle size={18} className="text-dozeblue mt-1" />
                      )}
                    </div>

                    {/* Stepper o precio base */}
                    <div className="flex items-center justify-between mt-2">
                      {isSelected ? (
                        <>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected((prev) => ({
                                  ...prev,
                                  [skey]: {
                                    rateIdx,
                                    occupancy: Math.max(
                                      1,
                                      currentOccupancy - 1
                                    ),
                                  },
                                }));
                              }}
                              className="w-6 h-6 rounded border border-gray-300 dark:border-white/30 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dozegray/30"
                              disabled={!isAvailable}
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm text-[var(--foreground)]">
                              {currentOccupancy}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected((prev) => ({
                                  ...prev,
                                  [skey]: {
                                    rateIdx,
                                    occupancy: Math.min(
                                      maxPax,
                                      currentOccupancy + 1
                                    ),
                                  },
                                }));
                              }}
                              className="w-6 h-6 rounded border border-gray-300 dark:border-white/30 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dozegray/30"
                              disabled={!isAvailable}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-[var(--foreground)] font-semibold">
                            {price ? `$${price.price}` : '--'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-[var(--foreground)] font-normal">
                            Precio desde:
                          </span>
                          <span className="text-sm text-[var(--foreground)] font-semibold">
                            {defaultPrice ? `$${defaultPrice.price}` : '--'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total y botón */}
            <div className="mt-4 flex justify-end items-center gap-4">
              {selectedRate &&
                (() => {
                  const rate = day.rates[selectedRate.rateIdx];
                  const price = rate?.prices.find(
                    (p) => p.occupancy === selectedRate.occupancy
                  );
                  return price ? (
                    <span className="text-[var(--foreground)] text-sm font-semibold">
                      Total: ${price.price} para {price.occupancy} pax
                    </span>
                  ) : (
                    <span className="text-[var(--foreground)] text-sm font-semibold">
                      Seleccioná cantidad de pax
                    </span>
                  );
                })()}

              <button
                disabled={!selectedRate}
                className="bg-dozeblue hover:bg-dozeblue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-semibold"
              >
                Reservar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AvailabilityResult;
