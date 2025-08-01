import { PmsData } from '@/types/pms';
import axios from './axios';

export const getPms = async (): Promise<PmsData[]> => {
  const response = await axios.get('/pms');
  return response.data;
};
