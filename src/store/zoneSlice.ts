import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchZones, fetchZoneById } from '@/services/zoneApi';
import { Zone } from '@/types/zone';

interface ZonesState {
  data: Zone[];
  selectedZone: Zone | null;
  loading: boolean;
  error: string | null;
}

const initialState: ZonesState = {
  data: [],
  selectedZone: null,
  loading: false,
  error: null,
};

export const getZones = createAsyncThunk('zones/fetch', async () => {
  return await fetchZones();
});

export const getZoneById = createAsyncThunk(
  'zones/fetchById',
  async (id: string, thunkAPI) => {
    try {
      return await fetchZoneById(id);
    } catch (error: unknown) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const zoneSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    clearSelectedZone: (state) => {
      state.selectedZone = null;
    },
    setSelectedZone: (state, action) => {
      state.selectedZone = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getZones.pending, (state) => {
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
      })
      .addCase(getZoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getZoneById.fulfilled, (state, action) => {
        state.selectedZone = action.payload;
        state.loading = false;
      })
      .addCase(getZoneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedZone, setSelectedZone } = zoneSlice.actions;
export default zoneSlice.reducer;
