import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  customerSignup,
  customerLogin,
  fetchCustomerProfile,
} from '@/services/customersApi';

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
      return await customerSignup(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || 'Error en el registro'
      );
    }
  }
);

export const loginCustomer = createAsyncThunk(
  'customer/login',
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      return await customerLogin(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || 'Error al iniciar sesión'
      );
    }
  }
);

export const getCustomerProfile = createAsyncThunk(
  'customer/profile',
  async (_, thunkAPI) => {
    try {
      return await fetchCustomerProfile();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || 'Error al obtener el perfil'
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
      })
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCustomerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
