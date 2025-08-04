'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getZones } from '@/store/zoneSlice';
import StepSelectZone from './StepSelectZone';
import StepBasicInfo from './StepBasicInfo';
import StepSelectLocation from './StepSelectLocation';
import StepCreateProperty from './StepCreateProperty';
import SyncPropertyForm from './SyncPropertyForm';
import { motion, AnimatePresence } from 'framer-motion';
import type { PropertyFormData } from '@/types/property';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';
import StepRoomEdit from './StepRoomEdit';

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const steps = [
  'Zona',
  'Datos básicos',
  'Ubicación',
  'Crear propiedad',
  'Sincronización',
  'Editar habitaciones',
];

export default function AddPropertyWizard() {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [step, setStep] = useState(1);
  const [createdPropertyId, setCreatedPropertyId] = useState<number | null>(
    null
  );

  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    name: '',
    address: '',
    description: '',
    coverImage: '',
    latitude: null,
    longitude: null,
    zone_id: null,
    zone: '',
    pms_id: null,
    images: [],
  });

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  const selectedZone = useMemo(() => {
    return zones.find((z) => z.id === propertyData.zone_id) || null;
  }, [zones, propertyData.zone_id]);

  const zoneCoordinates: [number, number][] = useMemo(() => {
    if (!selectedZone) return [];
    const coords = parseAreaToCoordinates(selectedZone.area);
    return coords.map((point) => {
      if (Array.isArray(point) && point.length === 2) {
        return [point[0] as number, point[1] as number];
      }
      return [0, 0];
    });
  }, [selectedZone]);

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
                onChange={(partialData) =>
                  setPropertyData((prev) => ({ ...prev, ...partialData }))
                }
                onBack={goBack}
                onNext={goNext}
                zones={zones}
                zonePolygon={zoneCoordinates}
              />
            )}
            {step === 4 && (
              <StepCreateProperty
                data={propertyData}
                onBack={goBack}
                onSubmit={(createdId: number) => {
                  setCreatedPropertyId(createdId);
                  setStep(5);
                }}
              />
            )}
            {step === 5 && createdPropertyId !== null && (
              <SyncPropertyForm
                propertyId={createdPropertyId}
                onSyncComplete={goNext}
              />
            )}
            {step === 6 && createdPropertyId !== null && (
              <StepRoomEdit propertyId={createdPropertyId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
