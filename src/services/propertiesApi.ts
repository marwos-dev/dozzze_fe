'use server';

import axios from './axios';
import { Property } from '@/types/property';
import { Room } from '@/types/room';

// Obtener propiedad por ID
export const fetchPropertyById = async (id: number): Promise<Property> => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};

// ✅ Corregido: obtener habitaciones de propiedad específica
export const getRooms = async (propertyId: number): Promise<Room[]> => {
  const response = await axios.get(`/properties/${propertyId}/rooms`);
  return response.data;
};

// Obtener habitación por ID
export const fetchRoomById = async (id: number): Promise<Room> => {
  const response = await axios.get(`/properties/rooms/${id}`);
  return response.data;
};

// Obtener propiedades por zona
export const getPropertiesByZoneId = async (
  id: number
): Promise<Property[]> => {
  const response = await axios.get(`/properties/zone/${id}`);
  return response.data;
};
