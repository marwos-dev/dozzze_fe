'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '@/store/zoneSlice';
import type { AppDispatch, RootState } from '@/store';

import Home from './Home';
import ZoneSection from './Zones';
import Seeker from './Seeker';
import { Zone } from '@/types/zone';

const Sections = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: zones, loading } = useSelector(
    (state: RootState) => state.zones
  );

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  return (
    <main>
      <Home />
      <ZoneSection zones={zones as Zone[]} loading={loading} />
      <>
        {' '}
        <section className="max-w-6xl mx-auto pt-10" id="seeker">
          <div className="text-center bg-greenlight rounded-t-xl  py-3 px-2">
            <h2 className="text-3xl font-semibold text-dozeblue">
              Descubrí espacios únicos para tu estadía
            </h2>
            <p className="mt-2 text-[var(--foreground)]">
              Lugares únicos disponibles en distintas zonas para tu próxima
              estadía
            </p>
          </div>
          <Seeker />
        </section>
        <section className="p-5" id="seeker"></section>
        {/* <section className="pb-5">
            <Properties zones={zones as Zone[]} />
          </section> */}
      </>
      )
    </main>
  );
};

export default Sections;
