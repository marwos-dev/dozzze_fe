'use client';

import ReservationTicket from './ReservationTicket';

interface Props {
  onBack: () => void;
}

export default function StepConfirmation({ onBack }: Props) {
  return (
    <div className="py-6 space-y-6">
      <ReservationTicket />
      <div className="text-center">
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 rounded-lg text-sm font-medium border border-dozeblue text-dozeblue hover:bg-dozeblue/10 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
