'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getZones } from '@/store/zoneSlice';
import StepSelectZone from './StepSelectZone';
import StepBasicInfo from './StepBasicInfo';
import StepSelectLocation from './StepSelectLocation';
import { motion, AnimatePresence } from 'framer-motion';
import type { PropertyFormData } from '@/types/property';

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const steps = ['Zona', 'Datos básicos', 'Ubicación'];

export default function AddPropertyWizard() {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    name: '',
    address: '',
    description: '',
    coverImage: '',
    latitude: null,
    longitude: null,
    zone_id: null,
    zone: '',
    images: [],
  });

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="px-4 sm:px-6 max-w-4xl mx-auto py-6 space-y-4">
      <div className="text-sm text-gray-600 dark:text-white/70">
        Paso {step} de {steps.length} — <strong>{steps[step - 1]}</strong>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {step === 1 && (
              <StepSelectZone
                zones={zones}
                data={propertyData}
                onChange={(data) => {
                  setPropertyData(data);
                  setStep(2);
                }}
                onNext={goNext}
              />
            )}
            {step === 2 && (
              <StepBasicInfo
                data={propertyData}
                onChange={setPropertyData}
                onNext={goNext}
                onBack={goBack}
                zones={zones}
              />
            )}
            {step === 3 && (
              <StepSelectLocation
                data={propertyData}
                onChange={setPropertyData}
                onBack={goBack}
                onNext={goNext}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        {step > 1 && (
          <button
            onClick={goBack}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
          >
            ← Atrás
          </button>
        )}
      </div>
    </div>
  );
}
