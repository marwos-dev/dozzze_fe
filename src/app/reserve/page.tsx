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
  const { t, lang } = useLanguage();
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
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] pb-20">
      <div className="pointer-events-none absolute -top-44 -left-32 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_75%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-36 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,124,232,0.12),transparent_72%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.17),transparent_75%)]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.12),transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.1),transparent_65%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pt-12">
        {/* Stepper */}
        <div className="rounded-3xl border border-white/60 bg-white p-8 shadow-[0_20px_40px_rgba(64,93,230,0.08)] backdrop-blur dark:border-white/10 dark:bg-dozebg1 dark:shadow-[0_25px_55px_rgba(5,16,45,0.55)]">
          <div className="flex items-center justify-between gap-6">
            {steps.map((label, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={index} className="flex w-full items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-semibold transition-all duration-300 ${
                        isCompleted
                          ? 'border-dozeblue bg-dozeblue text-white shadow-[0_10px_20px_rgba(2,31,89,0.25)] dark:shadow-[0_15px_35px_rgba(14,116,244,0.28)]'
                          : isActive
                            ? 'border-dozeblue bg-white text-dozeblue shadow-[0_10px_25px_rgba(64,93,230,0.25)] dark:bg-dozebg2 dark:text-dozeblue dark:shadow-[0_12px_28px_rgba(14,116,244,0.32)]'
                            : 'border-slate-200 bg-white/60 text-slate-400 dark:border-white/10 dark:bg-transparent dark:text-slate-500'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium tracking-wide transition-colors ${
                          isActive
                            ? 'text-dozeblue'
                          : isCompleted
                            ? 'text-[#13428f] dark:text-[#7fa8ff]'
                            : 'text-[var(--foreground)]/70 dark:text-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-xs uppercase tracking-[0.18em] ${
                          isActive ? 'text-dozeblue' : 'text-[var(--foreground)]/60 dark:text-slate-500'
                        }`}
                      >
                        {`${lang === 'es' ? 'Paso' : 'Step'} ${index + 1}`}
                      </span>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="relative hidden flex-1 items-center md:flex">
                      <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-dozeblue/15 via-dozeblue/25 to-transparent dark:from-white/10 dark:via-white/15" />
                      {isCompleted && (
                        <div className="absolute inset-0 h-[3px] w-full rounded-full bg-gradient-to-r from-dozeblue via-dozeblue/70 to-transparent" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {currentStep > 0 && (
          <div>
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-dozeblue to-[#142b87] px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(30,58,138,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(30,58,138,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue dark:from-[#4471d8] dark:to-[#2b4ba8] dark:shadow-[0_18px_40px_rgba(14,116,244,0.35)] dark:hover:shadow-[0_22px_46px_rgba(14,116,244,0.4)]"
            >
              <span aria-hidden="true">←</span>
              {t('reserve.buttons.back')}
            </button>
          </div>
        )}

        {/* Step content */}
        <div className="space-y-8">
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
      </div>
    </div>
  );
}
