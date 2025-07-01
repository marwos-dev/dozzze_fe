import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  customerSignup,
  customerLogin,
  fetchCustomerProfile,
} from '@/services/customersApi';
import { showToast } from './toastSlice';

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
  async (
    payload: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await customerSignup(payload);
      dispatch(
        showToast({ message: 'Cuenta creada exitosamente', color: 'green' })
      );
      return res;
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Error en el registro';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
    }
  }
);

export const loginCustomer = createAsyncThunk(
  'customer/login',
  async (
    payload: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await customerLogin(payload);
      dispatch(
        showToast({ message: 'Sesión iniciada correctamente', color: 'green' })
      );
      return res;
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Error al iniciar sesión';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
    }
  }
);

export const getCustomerProfile = createAsyncThunk(
  'customer/profile',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      return await fetchCustomerProfile();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Error al obtener el perfil';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
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
