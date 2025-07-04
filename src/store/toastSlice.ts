import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastData {
  message: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  duration: number;
}

interface ToastState {
  toast: ToastData | null;
}

const initialState: ToastState = {
  toast: null,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastData>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
