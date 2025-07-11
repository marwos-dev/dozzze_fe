import axios from './axios';
import {
  ReservationData,
  ReservationDataWithRooms,
} from '@/store/reserveSlice';
import type { Reservation, RedsysArgs, ReservationRequest } from '@/types/reservation';


const transformReservation = (reservation: ReservationData): Reservation => {
  const { roomType, ...rest } = reservation;

  return {
    ...rest,
    room_type: roomType,
    room_type_id: reservation.roomTypeID,
    guest_name: reservation.guest_name ?? '',
    guest_email: reservation.guest_email ?? '',
    guest_corporate: reservation.guest_corporate ?? null,
    guest_phone: reservation.guest_phone ?? '',
    guest_address: reservation.guest_address ?? '',
    guest_city: reservation.guest_city ?? '',
    guest_country: reservation.guest_country ?? '',
    guest_region: reservation.guest_region ?? '',
    guest_country_iso: reservation.guest_country_iso ?? '',
    guest_cp: reservation.guest_cp ?? '',
    guest_remarks: reservation.guest_remarks ?? '',

    cancellation_date: reservation.cancellation_date ?? null,
    modification_date: reservation.modification_date ?? null,
    paid_online: reservation.paid_online ?? 0,
    pay_on_arrival: reservation.pay_on_arrival ?? 1,
  };
};

export const postReservation = async (
  reservations: ReservationData[]
): Promise<ReservationRequest> => {
  const payload: Reservation[] = reservations.map(transformReservation);
  const response = await axios.post('/reservations/', payload);
  return response.data;
};

export const getMyReservations = async (): Promise<
  ReservationDataWithRooms[]
> => {
  const response = await axios.get('/reservations/my');
  return response.data;
};
