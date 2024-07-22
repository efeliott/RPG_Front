// ./src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

interface AuthState {
  user: null | { id: number; name: string; email: string };
  token: null | string;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const login: any = createAsyncThunk('auth/login', async (userCredentials: { email: string; password: string }) => {
  const response = await axios.post('/login', userCredentials);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };