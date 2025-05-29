'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '@/store/zoneSlice';
import type { AppDispatch, RootState } from '@/store';

import Home from './Home';
import ZoneSection from './Zones';
import Properties from './Properties';
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
          <ZoneSection zones={zones as Zone[]} />
          <section className="pb-5">
            <Properties zones={zones as Zone[]} />
          </section>
        </>
      )}

      <section className="p-5" id="seeker">
        <Seeker />
      </section>
    </main>
  );
};

export default Sections;
