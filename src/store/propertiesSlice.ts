import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPropertyById } from "@/services/propertiesApi";
import { Property } from "@/types/property";

interface PropertiesState {
  propertiesByZone: Record<number, Property[]>; // agrupadas por zone_id
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

// ✅ AsyncThunk: busca primero en el state antes de hacer fetch
export const getPropertyById = createAsyncThunk<
  Property,
  number,
  { state: { properties: PropertiesState }; rejectValue: string }
>("properties/getById", async (id, thunkAPI) => {
  const state = thunkAPI.getState().properties;

  // Buscar en todos los arrays de propiedades por id
  const allProperties = Object.values(state.propertiesByZone).flat();
  const cachedProperty = allProperties.find((prop) => prop.id === id);

  if (cachedProperty) {
    return cachedProperty;
  }

  try {
    const fetchedProperty = await fetchPropertyById(id);
    return fetchedProperty;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const propertiesSlice = createSlice({
  name: "properties",
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
      const zoneId = action.payload;
      delete state.propertiesByZone[zoneId];
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

        // Guardar la propiedad dentro de su zona si no estaba
        const zoneId = property.zone_id;
        if (!state.propertiesByZone[zoneId]) {
          state.propertiesByZone[zoneId] = [];
        }
        const exists = state.propertiesByZone[zoneId].some(
          (p) => p.id === property.id
        );
        if (!exists) {
          state.propertiesByZone[zoneId].push(property);
        }
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar propiedad";
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
