import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axios';
import { Zone } from '@/types/zone';


export const fetchZones = async (): Promise<Zone[]> => {
  const response = await axios.get('zones/');
  console.log(response.data)
  return response.data;
};



