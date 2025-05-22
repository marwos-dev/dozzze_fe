"use server";
import axios from "./axios";
import { Zone } from "@/types/zone";

export const fetchZones = async (): Promise<Zone[]> => {
  const response = await axios.get("zones/");
  return response.data;
};

export const fetchZoneById = async (id: string): Promise<Zone> => {
  const response = await axios.get(`/zones/${id}/`);
  return response.data;
};
