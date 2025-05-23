"use server";
import axios from "./axios";
import { Property } from "@/types/property";
import { Room } from "@/types/room";

export const fetchPropertyById = async (id: number): Promise<Property> => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};

export const getRooms = async (
  zoneId?: number,
  propertyId?: number
): Promise<Room[]> => {
  let url = "/properties/rooms";
  if (zoneId) {
    url += `?zone_id=${zoneId}`;
  }

  if (propertyId) {
    url += zoneId ? `&property_id=${propertyId}` : `?property_id=${propertyId}`;
  }
  const response = await axios.get(url);
  return response.data;
};

export const fetchRoomById = async (id: number): Promise<Room> => {
  const response = await axios.get(`/properties/rooms/${id}`);
  return response.data;
};

export const getPropertiesByZoneId = async (
  id: number
): Promise<Property[]> => {
  const response = await axios.get(`/properties/zone/${id}`);
  return response.data;
};
