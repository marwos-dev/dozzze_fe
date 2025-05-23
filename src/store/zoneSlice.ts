import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchZones, fetchZoneById } from "@/services/zoneApi";
import { Zone } from "@/types/zone";

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

// Fetch all zones, but avoid fetching if already in state
export const getZones = createAsyncThunk<
  Zone[],
  void,
  { state: { zones: ZonesState } }
>("zones/fetch", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  if (state.zones.data.length > 0) {
    // Evitar el fetch si ya tenemos datos
    return thunkAPI.rejectWithValue("Ya existen zonas cargadas en el estado");
  }
  return await fetchZones();
});

// Fetch one zone by ID, check if it's already selected or in data
export const getZoneById = createAsyncThunk<
  Zone,
  number,
  { state: { zones: ZonesState }; rejectValue: string }
>("zones/fetchById", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const { data } = state.zones;
  const foundZone = data.find((z) => z.id === id);
  if (foundZone) {
    return foundZone;
  }

  try {
    return await fetchZoneById(Number(id));
  } catch (error: unknown) {
    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const zoneSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    clearSelectedZone: (state) => {
      state.selectedZone = null;
    },
    setSelectedZone: (state, action) => {
      const foundZone = state.data.find((z) => z.id === action.payload);
      if (foundZone) {
        state.selectedZone = foundZone;
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
        // Solo mostrar error si no fue por zonas ya cargadas
        if (action.payload !== "Ya existen zonas cargadas en el estado") {
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
        state.loading = false;
        state.error = action.payload || "Error al cargar zona";
      });
  },
});

export const { clearSelectedZone, setSelectedZone } = zoneSlice.actions;
export default zoneSlice.reducer;
