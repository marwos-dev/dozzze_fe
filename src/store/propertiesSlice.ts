import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPropertyById } from "@/services/propertiesApi";
import { Property } from "@/types/property";

interface PropertiesState {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertiesState = {
  property: null,
  loading: false,
  error: null,
};

export const getPropertyById = createAsyncThunk(
  "properties/getById",
  async (id: string, thunkAPI) => {
    try {
      return await fetchPropertyById(id);
    } catch (error: unknown) {
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearProperty: (state) => {
      state.property = null;
      state.loading = false;
      state.error = null;
    },
    setProperty: (state, action) => {
      state.property = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.property = action.payload;
        state.loading = false;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProperty, setProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
