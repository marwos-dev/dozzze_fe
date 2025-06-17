import { RootState } from '@/store';

export const selectSelectedProperty = (state: RootState) =>
  state.properties.selectedProperty;

export const selectAvailability = (state: RootState) =>
  state.properties.availability;

export const selectPropertiesLoading = (state: RootState) =>
  state.properties.loading;

export const selectPropertiesError = (state: RootState) =>
  state.properties.error;
