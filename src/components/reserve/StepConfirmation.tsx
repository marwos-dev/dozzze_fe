'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ReservationTicket from './ReservationTicket';

interface Props {
  onBack: () => void;
}

export default function StepConfirmation({ onBack }: Props) {
  const redsysData = useSelector(
    (state: RootState) => state.reserve.redsysData
  );
  return (
    <div className="py-6 space-y-6">
      <ReservationTicket />

      {redsysData && (
        <form
          action={redsysData.endpoint}
          method="POST"
          id="redsys-payment-form"
          className="text-center"
        >
          <input
            type="hidden"
            name="Ds_SignatureVersion"
            value={redsysData.Ds_SignatureVersion}
          />
          <input
            type="hidden"
            name="Ds_MerchantParameters"
            value={redsysData.Ds_MerchantParameters}
          />
          <input
            type="hidden"
            name="Ds_Signature"
            value={redsysData.Ds_Signature}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            Pagar reserva
          </button>
        </form>
      )}

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
