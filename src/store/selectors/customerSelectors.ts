import { RootState } from '@/store';

export const selectCustomerProfile = (state: RootState) =>
  state.customer.profile;

export const selectCustomerLoading = (state: RootState) =>
  state.customer.loading;

export const selectCustomerError = (state: RootState) => state.customer.error;

export const selectIsCustomerLoggedIn = (state: RootState) =>
  !!state.customer.profile;
