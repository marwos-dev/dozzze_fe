import { ApiResponse } from '@/constants/responseCodes';
import axios from './axios';
import {
  Property,
  PropertyFormData,
  PropertyService,
  SyncData,
} from '@/types/property';

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
    pms_id: data.pms_id,
  };
  const response = await axios.post('/properties/my/', payload, {
    withCredentials: true,
  });
  return response.data;
};
export const syncPropertyPMSData = async (
  propertyId: number,
  syncData: {
    base_url: string;
    email: string;
    phone_number: string;
    pms_token: string;
    pms_hotel_identifier: string;
    pms_username: string;
    pms_password: string;
  }
): Promise<void> => {
  const response = await axios.post(
    `/properties/my/${propertyId}/pms-data`,
    syncData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const syncFinalPropertyWithPMS = async (
  propertyId: number
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await axios.post<
    ApiResponse<{ success: boolean; message: string }>
  >(`/properties/my/${propertyId}/sync`, {}, { withCredentials: true });
  return response.data;
};
export const fetchMyProperties = async (): Promise<Property[]> => {
  const response = await axios.get('/properties/my/', {
    withCredentials: true,
  });
  return response.data;
};
// Obtener datos PMS existentes (GET)
export const getPmsData = async (propertyId: number): Promise<SyncData> => {
  const response = await axios.get(`/properties/my/${propertyId}/pms-data`, {
    withCredentials: true,
  });
  return response.data;
};

// Obtener propiedad por ID
export const fetchPropertyById = async (id: number): Promise<Property> => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};

// Obtener propiedad por nombre (slug)
export const fetchPropertyByName = async (name: string): Promise<Property> => {
  const encoded = encodeURIComponent(name);
  const response = await axios.get(`/properties/name/${encoded}`);
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
export async function uploadPropertyImage(
  propertyId: number,
  file: File,
  caption = ''
): Promise<void> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('caption', caption);

  await axios.post(`/properties/my/${propertyId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
export const fetchAllProperties = async (): Promise<Property[]> => {
  const response = await axios.get(`/properties/`);
  return response.data;
};


export async function updateProperty(
  propertyId: number,
  data: Partial<PropertyFormData>
): Promise<void> {
  const { name, description, address, latitude, longitude, zone_id } = data;

  const payload = {
    name,
    description,
    address,
    latitude,
    longitude,
    zone_id,
  };

  await axios.put(`/properties/my/${propertyId}`, payload, {
    withCredentials: true,
  });
}

export const getPropertyServices = async (
  propertyId: number
): Promise<PropertyService[]> => {
  const response = await axios.get(
    `/properties/my/${propertyId}/services`,
    { withCredentials: true }
  );
  return response.data;
};

export const createPropertyService = async (
  propertyId: number,
  data: { code: string; name: string; description?: string }
): Promise<PropertyService> => {
  const response = await axios.post(
    `/properties/my/${propertyId}/services`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const updatePropertyService = async (
  propertyId: number,
  serviceId: number,
  data: { code: string; name: string; description?: string }
): Promise<PropertyService> => {
  const response = await axios.put(
    `/properties/my/${propertyId}/services/${serviceId}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const deletePropertyService = async (
  propertyId: number,
  serviceId: number
): Promise<void> => {
  await axios.delete(`/properties/my/${propertyId}/services/${serviceId}`, {
    withCredentials: true,
  });
};

export const fetchAllServices = async (): Promise<PropertyService[]> => {
  const response = await axios.get('/properties/services', {
    withCredentials: true,
  });
  return response.data;
};
