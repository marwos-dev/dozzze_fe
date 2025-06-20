import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReservationData {
  property_id: number;
  channel: string;
  pax_count: number;
  currency: string;
  roomType: string;
  rooms: number;
  total_price: number;
  check_in: string;
  check_out: string;
  guest_corporate?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_address?: string;
  guest_city?: string;
  guest_country?: string;
  guest_region?: string;
  guest_country_iso?: string;
  guest_cp?: string;
  guest_remarks?: string;
  cancellation_date?: string;
  modification_date?: string;
  paid_online?: number;
  pay_on_arrival?: number;
}

interface ReserveState {
  data: Partial<ReservationData> | null;
}

const initialState: ReserveState = {
  data: null,
};

const reserveSlice = createSlice({
  name: 'reserve',
  initialState,
  reducers: {
    setReservationData(state, action: PayloadAction<Partial<ReservationData>>) {
      state.data = { ...state.data, ...action.payload };
    },
    clearReservationData(state) {
      state.data = null;
    },
  },
});

export const { setReservationData, clearReservationData } =
  reserveSlice.actions;
export default reserveSlice.reducer;
