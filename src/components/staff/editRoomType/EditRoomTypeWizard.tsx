'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { getZones } from '@/store/zoneSlice';
import StepSelectZone from '../StepSelectZone';
import type { PropertyFormData } from '@/types/property';
import { motion, AnimatePresence } from 'framer-motion';
import StepSelectPropertyFromZone from './StepSelectedProperty';
import { getPropertyById } from '@/store/propertiesSlice';
import StepRoomEdit from '../StepRoomEdit';

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const steps = ['Zona', 'Propiedad', 'Editar habitaciones'];

export default function EditRoomWizard() {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step, setStep] = useState(1);
  const [zoneData, setZoneData] = useState<
    Pick<PropertyFormData, 'zone' | 'zone_id'>
  >({
    zone: '',
    zone_id: null,
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );

  const selectedZone = useMemo(() => {
    return zones.find((z) => z.id === zoneData.zone_id) || null;
  }, [zones, zoneData.zone_id]);

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  const handleNext = () => {
    if (zoneData.zone_id) {
      setStep(2);
    }
  };

  const handleSelectProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    dispatch(getPropertyById(propertyId));
    setStep(3);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="px-4 sm:px-6 max-w-5xl mx-auto py-6 space-y-4">
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
                data={zoneData as PropertyFormData}
                onChange={(newData) => setZoneData(newData)}
                onNext={handleNext}
              />
            )}

            {step === 2 && selectedZone && (
              <StepSelectPropertyFromZone
                zone={selectedZone}
                onSelectProperty={handleSelectProperty}
              />
            )}

            {step === 3 && selectedPropertyId && (
              <StepRoomEdit propertyId={selectedPropertyId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
