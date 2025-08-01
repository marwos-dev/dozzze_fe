import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  customerSignup,
  customerLogin,
  fetchCustomerProfile,
} from '@/services/customersApi';
import { showToast } from './toastSlice';
import { Customer } from '@/types/costumers';
import { activateCustomerAccount as apiActivateCustomerAccount } from '@/services/customersApi';
import Cookies from 'js-cookie';
import axios from '@/services/axios';

interface CustomerState {
  loading: boolean;
  error: string | null;
  profile: Customer | null;
  checked: boolean;
}

const initialState: CustomerState = {
  loading: false,
  error: null,
  profile: null,
  checked: false,
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      const msg = axiosError?.response?.data?.error || 'Error en el registro';
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
      const token = res.access;
      Cookies.set('accessToken', token, {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: 30, // días
      });

      Cookies.set('customerProfile', JSON.stringify(res), {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: 30,
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(
        showToast({ message: 'Sesión iniciada correctamente', color: 'green' })
      );
      return res;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      const msg =
        axiosError?.response?.data?.error || 'Error al iniciar sesión';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
    }
  }
);

export const getCustomerProfile = createAsyncThunk(
  'customer/profile',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      if (!Cookies.get('accessToken')) return;
      const profile = await fetchCustomerProfile();
      Cookies.set('customerProfile', JSON.stringify(profile), {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: 30,
      });
      return profile;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      const msg =
        axiosError?.response?.data?.error || 'Error al obtener el perfil';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
    }
  }
);
export const activateCustomerAccount = createAsyncThunk(
  'customer/activate',
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await apiActivateCustomerAccount(token);
      dispatch(
        showToast({
          message: res.message || 'Cuenta activada exitosamente',
          color: 'green',
        })
      );
      return res;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError?.response?.data?.detail || 'Error al activar la cuenta';
      dispatch(showToast({ message: msg, color: 'red' }));
      return rejectWithValue(msg);
    }
  }
);

// Resto del slice sin cambios

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomer: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.profile = action.payload;
      state.checked = true;
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
        state.checked = true;
      })
      .addCase(getCustomerProfile.rejected, (state) => {
        state.profile = null;
        state.checked = true;
        Cookies.remove('accessToken');
        Cookies.remove('customerProfile');
        delete axios.defaults.headers.common['Authorization'];
      })
      .addCase(activateCustomerAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateCustomerAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activateCustomerAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomer, setCustomer } = customerSlice.actions;
export default customerSlice.reducer;
