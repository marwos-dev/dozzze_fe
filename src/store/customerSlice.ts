import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerSignup } from '@/services/customersApi';

interface CustomerState {
  loading: boolean;
  error: string | null;
  profile: any | null;
}

const initialState: CustomerState = {
  loading: false,
  error: null,
  profile: null,
};

export const signupCustomer = createAsyncThunk(
  'customer/signup',
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await customerSignup(payload);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || 'Error en el registro'
      );
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomer: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(signupCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
