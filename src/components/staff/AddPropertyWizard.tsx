'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getZones } from '@/store/zoneSlice';
import StepBasicInfo from './StepBasicInfo';
import StepSelectLocation from './StepSelectLocation';

export default function AddPropertyWizard() {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: '',
    address: '',
    description: '',
    coverImage: '',
    latitude: null as number | null,
    longitude: null as number | null,
    zone_id: null as number | null,
  });

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  return (
    <div>
      {step === 1 && (
        <StepBasicInfo
          data={propertyData}
          onChange={setPropertyData}
          onNext={goNext}
          zones={zones || []}
        />
      )}
      {step === 2 && (
        <StepSelectLocation
          data={propertyData}
          onChange={setPropertyData}
          onBack={goBack}
          onNext={goNext}
        />
      )}
    </div>
  );
}
