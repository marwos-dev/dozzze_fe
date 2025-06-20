'use client';

import { useState } from 'react';
import StepReservationSummary from '@/components/reserve/StepReservationSummary';
import StepGuestDetails from '@/components/reserve/StepGuestDetails';
import StepConfirmation from '@/components/reserve/StepConfirmation';

const steps = ['Tu selección', 'Tus datos', 'Terminar reserva'];

export default function ReservePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Stepper con colores y estilo legible */}
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

      {/* Step content */}
      {currentStep === 0 && <StepReservationSummary onNext={goNext} />}
      {currentStep === 1 && (
        <StepGuestDetails onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 2 && <StepConfirmation onBack={goBack} />}
    </div>
  );
}
