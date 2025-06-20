import { RootState } from '@/store';

export const selectReservationData = (state: RootState) => state.reserve.data;
