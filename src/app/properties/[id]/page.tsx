'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loadFullPropertyById } from '@/store/propertiesSlice';
import RoomCard from '@/components/ui/cards/RoomsCard/RoomCard';
import Spinner from '@/components/ui/spinners/Spinner';
import PropertyBanner from '@/components/ui/banners/PropertyBanner';
import { selectFilteredRoomsForProperty } from '@/store/selectors/roomsSelectors';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import PropertyBannerSkeleton from '@/components/ui/skeletons/PropertyBannerSkeleton';
import RoomCardSkeleton from '@/components/ui/skeletons/RoomCardSkeleton';

interface PageProps {
  params: Promise<{ id: number }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const numericId = Number(id);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProperty, loading, error } = useSelector(
    (state: RootState) => state.properties
  );

  const [capacityFilter, setCapacityFilter] = useState<number>(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadFullPropertyById(numericId));
  }, [numericId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRooms = useSelector(
    selectFilteredRoomsForProperty(numericId, capacityFilter, categoryFilter)
  ).filter((room) =>
    selectedServices.length > 0
      ? selectedServices.every((service) => room.services?.includes(service))
      : true
  );

  const rooms =
    selectedProperty?.id === numericId ? selectedProperty.rooms || [] : [];

  if (loading || !selectedProperty || selectedProperty.id !== numericId)
    return (
      <div className="overflow-x-hidden max-w-6xl mx-auto px-4 py-6 space-y-6">
        <PropertyBannerSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (error) {
    return <p className="text-center text-red-500">Propiedad no encontrada.</p>;
  }

  const roomTypes = Array.from(
    new Set((selectedProperty.rooms || []).map((r) => r.type))
  );

  const allServices = Array.from(
    new Set(
      (selectedProperty.rooms || [])
        .flatMap((r) => r.services || [])
        .filter((s) => typeof s === 'string')
    )
  );

  return (
    <div className="overflow-x-hidden max-w-6xl mx-auto px-4 py-6">
      <PropertyBanner property={selectedProperty} roomsCount={rooms.length} />

      {/* Filtros */}
      <section className="bg-white rounded-b-2xl shadow-md -mt-8 px-6 pt-4 pb-4 border-t-0 border border-gray-200">
        <h3 className="text-dozeblue text-base font-semibold mb-4 text-center">
          Busca tu habitación
        </h3>

        <div className="flex flex-col sm:flex-row justify-center items-start gap-3 sm:gap-6">
          {/* Capacidad */}
          <div className="flex flex-col w-full sm:w-[160px] shrink-0">
            <label className="text-xs font-medium text-dozegray mb-1">
              Capacidad mínima
            </label>
            <div className="flex items-center border border-gray-300 rounded px-2 h-8 justify-between bg-white">
              <button
                onClick={() =>
                  setCapacityFilter((prev) => Math.max(1, prev - 1))
                }
                className="text-dozeblue hover:text-blue-800"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm text-dozeblue">{capacityFilter}</span>
              <button
                onClick={() => setCapacityFilter((prev) => prev + 1)}
                className="text-dozeblue hover:text-blue-800"
              >
                <Plus size={12} />
              </button>
            </div>
            <span className="text-[11px] mt-1 text-center text-dozegray">
              {capacityFilter} persona{capacityFilter > 1 ? 's' : ''}
            </span>
          </div>

          {/* Tipo */}
          <div className="flex flex-col w-full sm:w-[160px] shrink-0">
            <label className="text-xs font-medium text-dozegray mb-1">
              Tipo de habitación
            </label>
            <select
              value={categoryFilter || ''}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value === '' ? undefined : e.target.value
                )
              }
              className="border border-gray-300 text-dozeblue rounded px-2 h-8 text-sm bg-white"
            >
              <option value="">Todas</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Servicios */}
          {allServices.length > 0 && (
            <div
              className="flex flex-col w-full sm:w-[160px] shrink-0 relative"
              ref={serviceDropdownRef}
            >
              <label className="text-xs font-medium text-dozegray mb-1">
                Servicios incluidos
              </label>
              <button
                type="button"
                onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
                className="border border-gray-300 rounded px-2 h-8 text-sm text-dozeblue flex items-center justify-between w-full bg-white"
              >
                {selectedServices.length > 0
                  ? `Seleccionados: ${selectedServices.length}`
                  : 'Seleccioná servicios'}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {isServiceDropdownOpen && (
                <div className="absolute top-[100%] left-0 mt-2 w-full max-h-48 overflow-y-auto border border-gray-300 bg-white rounded shadow p-2 z-50">
                  {allServices.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() =>
                          setSelectedServices((prev) =>
                            prev.includes(service)
                              ? prev.filter((s) => s !== service)
                              : [...prev, service]
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-dozeblue">{service}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Habitaciones filtradas */}
      <section className="mt-6">
        {filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay habitaciones que coincidan con los filtros seleccionados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 -mt-4 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                services={room.services || []}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
