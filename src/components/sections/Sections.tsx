'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '@/store/zoneSlice';
import type { AppDispatch, RootState } from '@/store';

import Home from './Home';
import ZoneSection from './Zones';
import Seeker from './Seeker';
import Spinner from '@/components/ui/spinners/Spinner';
import { Zone } from '@/types/zone';

const Sections = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: zones,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  return (
    <main>
      <Home />
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <>
          {' '}
          <section className="max-w-6xl bg-dozebg2 mx-auto" id="seeker">
            <div className="text-center bg-greenlight rounded-t-xl  py-3 px-2">
              <h2 className="text-3xl font-semibold text-dozeblue">
                Descubrí espacios únicos para tu estadía
              </h2>
              <p className="text-gray-700 mt-2">
                Lugares únicos disponibles en distintas zonas para tu próxima
                estadía
              </p>
            </div>
            <Seeker />
          </section>
          <section className="p-5" id="seeker"></section>
          <ZoneSection zones={zones as Zone[]} />
          {/* <section className="pb-5">
            <Properties zones={zones as Zone[]} />
          </section> */}
        </>
      )}
    </main>
  );
};

export default Sections;
