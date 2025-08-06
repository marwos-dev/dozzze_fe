import axios from './axios';
import type { VoucherValidationResponse } from '@/types/voucher';

export const validateVoucher = async (
  code: string
): Promise<VoucherValidationResponse> => {
  const response = await axios.get(`/vouchers/validate/${code}`);
  return response.data;
};
