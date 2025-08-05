'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { getZones } from '@/store/zoneSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '@/store/propertiesSlice';
import StepRoomEdit from '../StepRoomEdit';

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

interface Props {
  initialPropertyId?: number;
}

export default function EditRoomWizard({ initialPropertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step] = useState(3);
  const [selectedPropertyId] = useState<number | null>(
    initialPropertyId ?? null
  );

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  useEffect(() => {
    if (initialPropertyId) {
      dispatch(getPropertyById(initialPropertyId));
    }
  }, [initialPropertyId, dispatch]);

  return (
    <div className="px-4 sm:px-6 max-w-5xl mx-auto py-6 space-y-4">
      <div className="text-sm text-gray-600 dark:text-white/70">
        Paso {step} de 3 — <strong>Editar habitaciones</strong>
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
            {selectedPropertyId && (
              <StepRoomEdit propertyId={selectedPropertyId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
