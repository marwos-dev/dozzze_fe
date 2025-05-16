import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchZones } from '@/services/zoneApi';
import { Zone } from '@/types/zone';

interface ZonesState {
  data: Zone[];
  loading: boolean;
  error: string | null; 
}

const initialState: ZonesState = {
  data: [],
  loading: false,
  error: null,
};

export const getZones = createAsyncThunk<Zone[], void>(
  'zones/fetch',
  async () => {
    return  fetchZones();
  }
);

const zoneSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getZones.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getZones.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar zonas';
      });
  },
});

export default zoneSlice.reducer;
