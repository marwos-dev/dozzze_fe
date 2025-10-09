'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { deleteReservation, updateReservation } from '@/store/reserveSlice';
import StepReservationSummary from '@/components/reserve/StepReservationSummary';
import StepGuestDetails from '@/components/reserve/StepGuestDetails';
import StepConfirmation from '@/components/reserve/StepConfirmation';
import VoucherOrLoginPrompt from '@/components/ui/VoucherOrLoginPrompt';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ReservePage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialStepParam = parseInt(searchParams.get('step') || '0', 10);
  const steps = [
    t('reserve.steps.selection') as string,
    t('reserve.steps.details') as string,
    t('reserve.steps.confirmation') as string,
  ];
  const [currentStep, setCurrentStep] = useState(
    isNaN(initialStepParam) ? 0 : Math.min(initialStepParam, steps.length - 1)
  );

  const reservations = useSelector((state: RootState) => state.reserve.data);
  const zones = useSelector((state: RootState) => state.zones.data);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const goNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    reservations.forEach((res, index) => {
      if (!res.terms_and_conditions) {
        const property = zones
          .flatMap((zone) => zone.properties || [])
          .find((p) => p.id === res.property_id);

        if (property?.terms_and_conditions) {
          dispatch(
            updateReservation({
              index,
              data: {
                terms_and_conditions: property.terms_and_conditions,
                property_name: property.name,
              },
            })
          );
        }
      }
    });
  }, [reservations, zones, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between pl-6">
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex items-center w-full">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-dozeblue text-white border-dozeblue'
                      : isActive
                        ? 'bg-white text-dozeblue border-dozeblue'
                        : 'bg-white text-gray-400 border-gray-300 dark:bg-dozegray/10 dark:text-gray-500 dark:border-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-dozeblue'
                      : isCompleted
                        ? 'text-[var(--foreground)]'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 dark:bg-white/10 mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {currentStep > 0 && (
        <div className="pl-6">
          <button
            onClick={goBack}
            className="text-dozeblue border border-dozeblue px-4 py-2 rounded-lg text-sm font-medium hover:bg-dozeblue/10 transition-colors"
          >
            {t('reserve.buttons.back')}
          </button>
        </div>
      )}

      {/* Step content */}
      {currentStep === 0 && (
        <>
          <VoucherOrLoginPrompt />
          <StepReservationSummary
            onNext={goNext}
            reservations={reservations}
            onAddReservation={() => router.push('/#seeker')}
            onDeleteReservation={(index) => dispatch(deleteReservation(index))}
          />
        </>
      )}

      {currentStep === 1 && (
        <StepGuestDetails
          reservationIndex={0}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {currentStep === 2 && <StepConfirmation onBack={goBack} />}
    </div>
  );
}
