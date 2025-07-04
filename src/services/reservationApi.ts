'use server';

import axios from './axios';
import { ReservationData } from "@/store/reserveSlice";
import { ReservationRequest } from "@/types/reservation";

// Obtener propiedad por ID
export const postReservation = async (reservation: ReservationData): Promise<ReservationRequest> => {
  const data_to_send = {...reservation, room_type: reservation.roomType};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  delete data_to_send.roomType; // Eliminar roomType para evitar duplicados
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  delete data_to_send.rooms;
  console.log("la reserva: ",{data_to_send})
  const response = await axios.post(`/reservations/`, data_to_send);
  return response.data;
};
