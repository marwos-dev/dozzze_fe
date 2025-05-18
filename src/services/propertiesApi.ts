import axios from "./axios";
import { Property } from "@/types/property";

export const fetchPropertyById = async (id: string): Promise<Property> => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};
