'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '@/store/zoneSlice';
import type { AppDispatch, RootState } from '@/store';

import ZoneSection from './Zones';
import { Zone } from '@/types/zone';
import { useLanguage } from '@/i18n/LanguageContext';
import SeekerResults from '../ui/seeker/SeekerResults';

const Sections = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: zones, loading } = useSelector(
    (state: RootState) => state.zones
  );
  useLanguage();

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  return (
    <main>
      <div id="results">
        <SeekerResults showActions />
      </div>
      <ZoneSection zones={zones as Zone[]} loading={loading} />
      {/* Resultados de disponibilidad */}
      <>
        {' '}
        <section className="max-w-6xl mx-auto pt-10" id="seeker"></section>
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
