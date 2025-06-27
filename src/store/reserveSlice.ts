import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '@/types/property';

export interface ReservationData {
  property_id: number;
  property_name?: string;
  terms_and_conditions?: Property['terms_and_conditions'];
  cover_image?: string;
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
  data: ReservationData[];
}

const initialState: ReserveState = {
  data: [],
};

const reserveSlice = createSlice({
  name: 'reserve',
  initialState,
  reducers: {
    addReservation(state, action: PayloadAction<ReservationData>) {
      state.data.push(action.payload);
    },
    updateReservation(
      state,
      action: PayloadAction<{ index: number; data: Partial<ReservationData> }>
    ) {
      const { index, data } = action.payload;
      if (state.data[index]) {
        state.data[index] = { ...state.data[index], ...data };
      }
    },
    deleteReservation(state, action: PayloadAction<number>) {
      state.data.splice(action.payload, 1);
    },
    clearReservations(state) {
      state.data = [];
    },
  },
});

export const {
  addReservation,
  updateReservation,
  deleteReservation,
  clearReservations,
} = reserveSlice.actions;

export default reserveSlice.reducer;
