import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPropertyById } from '@/services/propertiesApi';
import { Property } from '@/types/property';
import { RootState, AppDispatch } from '@/store';
import { fetchRooms } from './roomsSlice';
import { Zone } from '@/types/zone';

interface PropertiesState {
  propertiesByZone: Record<number, Property[]>;
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertiesState = {
  propertiesByZone: {},
  selectedProperty: null,
  loading: false,
  error: null,
};

// Obtener propiedad por ID con cache desde zones, luego local y luego API
export const getPropertyById = createAsyncThunk<
  Property,
  number,
  { state: RootState; rejectValue: string }
>('properties/getById', async (propertyId, thunkAPI) => {
  const state = thunkAPI.getState();

  // Buscar en zonas (properties de cada zone)
  const allZoneProperties = state.zones.data.flatMap((zone: Zone) =>
    Array.isArray(zone.properties) ? zone.properties : []
  );
  const fromZone = allZoneProperties.find(
    (p: { id: number }) => p.id === propertyId
  );
  if (fromZone) return fromZone;

  // Buscar en cache local del slice
  const allCached: Property[] = Object.values(
    state.properties.propertiesByZone
  ).flat() as Property[];
  const fromCache = allCached.find((p) => p.id === propertyId);
  if (fromCache) return fromCache;

  // Fetch desde API
  try {
    const fetched = await fetchPropertyById(propertyId);
    return fetched;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
    return thunkAPI.rejectWithValue(errorMsg);
  }
});

// Thunk combinado: carga propiedad + habitaciones
export const loadFullPropertyById = createAsyncThunk<
  void,
  number,
  { dispatch: AppDispatch; state: RootState }
>('properties/loadFull', async (propertyId, { dispatch }) => {
  const result = await dispatch(getPropertyById(propertyId));
  if (getPropertyById.fulfilled.match(result)) {
    dispatch(fetchRooms({ propertyId }));
  }
});

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearSelectedProperty(state) {
      state.selectedProperty = null;
      state.loading = false;
      state.error = null;
    },
    setSelectedProperty(state, action: PayloadAction<Property>) {
      state.selectedProperty = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPropertiesForZone(
      state,
      action: PayloadAction<{ zoneId: number; properties: Property[] }>
    ) {
      const { zoneId, properties } = action.payload;
      state.propertiesByZone[zoneId] = properties;
    },
    clearPropertiesForZone(state, action: PayloadAction<number>) {
      delete state.propertiesByZone[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        const property = action.payload;
        state.selectedProperty = property;
        state.loading = false;
        state.error = null;

        const zoneId = property.zone_id;
        if (zoneId) {
          const current = state.propertiesByZone[zoneId] || [];
          const alreadyStored = current.some((p) => p.id === property.id);
          if (!alreadyStored) {
            state.propertiesByZone[zoneId] = [...current, property];
          }
        }
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error al cargar propiedad';
      });
  },
});

export const {
  clearSelectedProperty,
  setSelectedProperty,
  setPropertiesForZone,
  clearPropertiesForZone,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
