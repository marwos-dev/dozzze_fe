import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchZones, fetchZoneById } from '@/services/zoneApi';
import { Zone } from '@/types/zone';

interface ZoneWithTimestamp extends Zone {
  lastFetched?: number;
}

interface ZonesState {
  data: Zone[];
  selectedZone: ZoneWithTimestamp | null;
  loading: boolean;
  error: string | null;
}

const initialState: ZonesState = {
  data: [],
  selectedZone: null,
  loading: false,
  error: null,
};

export const getZones = createAsyncThunk<
  Zone[],
  void,
  { state: { zones: ZonesState } }
>('zones/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  if (state.zones.data.length > 0) {
    return thunkAPI.rejectWithValue('Ya existen zonas cargadas en el estado');
  }
  return await fetchZones();
});

export const getZoneById = createAsyncThunk<
  ZoneWithTimestamp,
  number,
  { state: { zones: ZonesState }; rejectValue: string }
>('zones/fetchById', async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const { selectedZone } = state.zones;

  const STALE_TIME = 5 * 60 * 1000; // 5 minutos

  // Si ya está seleccionada y no está vencida, no hace falta refetch
  if (
    selectedZone &&
    selectedZone.id === id &&
    selectedZone.lastFetched &&
    Date.now() - selectedZone.lastFetched < STALE_TIME
  ) {
    return thunkAPI.rejectWithValue('Zona actual ya cargada recientemente');
  }

  // Buscar en cache general (`data`)
  const cachedZone = state.zones.data.find((z) => z.id === id);
  if (cachedZone) {
    return {
      ...cachedZone,
      lastFetched: Date.now(),
    };
  }

  try {
    const zone = await fetchZoneById(id);
    return {
      ...zone,
      lastFetched: Date.now(),
    };
  } catch (error: unknown) {
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const zoneSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    clearSelectedZone: (state) => {
      state.selectedZone = null;
    },
    setSelectedZone: (state, action) => {
      const foundZone = state.data.find((z) => z.id === action.payload);
      if (foundZone) {
        state.selectedZone = {
          ...foundZone,
          lastFetched: Date.now(),
        };
        state.loading = false;
        state.error = null;
      }
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
        if (action.payload !== 'Ya existen zonas cargadas en el estado') {
          state.error = action.payload as string;
        }
        state.loading = false;
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
        if (
          typeof action.payload === 'string' &&
          action.payload.includes('recientemente')
        ) {
          // No es error real, solo info
          return;
        }
        state.loading = false;
        state.error = action.payload || 'Error al cargar zona';
      });
  },
});

export const { clearSelectedZone, setSelectedZone } = zoneSlice.actions;
export default zoneSlice.reducer;
