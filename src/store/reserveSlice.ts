import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '@/types/property';

export type RoomReservationData = {
  room_type: string;
  price: number;
  guests: number;
};

export interface ReservationData {
  id?: number;
  reservation_id?: number;
  property_id: number;
  property_name?: string;
  terms_and_conditions?: Property['terms_and_conditions'];
  cover_image?: string;
  channel: string;
  pax_count: number;
  currency: string;
  roomType: string;
  room_type?: string;
  roomTypeID: number;
  rate_id: number;
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
  images?: string[];
}

export interface ReservationDataWithRooms extends ReservationData {
  room_reservations: RoomReservationData[];
}

export interface RedsysData {
  endpoint: string;
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
}

export interface DiscountInfo {
  code: string;
  type: 'coupon' | 'voucher';
  name?: string;
  discount_percent?: number;
  remaining_amount?: number;
}

interface ReserveState {
  data: ReservationData[];
  redsysData: RedsysData | null;
  discount: DiscountInfo | null;
}

const initialState: ReserveState = {
  data: [],
  redsysData: null,
  discount: null,
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
    updateReservations(state, action: PayloadAction<ReservationData[]>) {
      state.data = action.payload;
    },
    deleteReservation(state, action: PayloadAction<number>) {
      state.data.splice(action.payload, 1);
    },
    clearReservations(state) {
      state.data = [];
      state.redsysData = null;
      state.discount = null;
    },
    setRedsysData(state, action: PayloadAction<RedsysData>) {
      state.redsysData = action.payload;
    },
    applyCoupon(
      state,
      action: PayloadAction<{ code: string; name: string; percent: number }>
    ) {
      const { code, name, percent } = action.payload;
      state.discount = {
        code,
        type: 'coupon',
        name,
        discount_percent: percent,
      };
    },
    applyVoucher(
      state,
      action: PayloadAction<{ code: string; amount: number }>
    ) {
      const { code, amount } = action.payload;
      state.discount = {
        code,
        type: 'voucher',
        remaining_amount: amount,
      };
    },
  },
});

export const {
  addReservation,
  updateReservation,
  updateReservations,
  deleteReservation,
  clearReservations,
  setRedsysData,
  applyCoupon,
  applyVoucher,
} = reserveSlice.actions;

export default reserveSlice.reducer;
