'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { getZones } from '@/store/zoneSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '@/store/propertiesSlice';
import type { PropertyFormData } from '@/types/property';
import StepRoomEdit from '../StepRoomEdit';
import StepSelectPropertyGrouped from './StepSelectPropertyGrouped';

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
  >({ zone: '', zone_id: null });

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

  const handleSelectProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    dispatch(getPropertyById(propertyId));
    setStep(3);
  };

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
              <StepSelectPropertyGrouped
                zones={zones}
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
