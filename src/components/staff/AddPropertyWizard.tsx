'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getZones } from '@/store/zoneSlice';
import StepSelectZone from './StepSelectZone';
import StepBasicInfo from './StepBasicInfo';
import StepSelectLocation from './StepSelectLocation';
import type { PropertyFormData } from '@/types/property';

export default function AddPropertyWizard() {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    name: '',
    address: '',
    description: '',
    zone: '',
    zone_id: null,
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
        <StepSelectZone
          zones={zones}
          data={propertyData}
          onChange={setPropertyData}
          onNext={goNext}
        />
      )}
      {step === 2 && (
        <StepBasicInfo
          data={propertyData}
          onChange={setPropertyData}
          onNext={goNext}
          zones={zones}
        />
      )}
      {/* {step === 3 && (
        <StepSelectLocation
          data={propertyData}
          onChange={setPropertyData}
          onBack={goBack}
          onNext={goNext}
        />
      )} */}
    </div>
  );
}
