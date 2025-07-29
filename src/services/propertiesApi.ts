import axios from './axios';
import { Property, PropertyFormData } from '@/types/property';
import { Room } from '@/types/room';
import { AvailabilityPayload, AvailabilityResponse } from '@/types/roomType';

export const createProperty = async (data: PropertyFormData) => {
  const payload = {
    name: data.name,
    description: data.description,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    zone_id: data.zone_id,
    images: data.images,
  };
  const response = await axios.post('/properties/my/', payload, {
    withCredentials: true,
  });
  return response.data;
};

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
// consultar disponibilidad

export const checkPropertyAvailability = async (
  data: AvailabilityPayload
): Promise<AvailabilityResponse> => {
  const response = await axios.post('/properties/availability/', data);
  return response.data;
};
