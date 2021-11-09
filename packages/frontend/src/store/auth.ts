import { createSlice, PayloadAction, Middleware } from '@reduxjs/toolkit';

const tokenKey = '@decarbonizer/auth:token';

export interface AuthState {
  token?: string;
}

const initialState: AuthState = {
  token: localStorage.getItem(tokenKey) ?? undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, { payload: { token } }: PayloadAction<{ token: string }>) {
      state.token = token;
    },
    loggedOut(state) {
      state.token = undefined;
    },
  },
});

export const authMiddleware: Middleware = () => (next) => (action) => {
  if (action.type === authSlice.actions.loggedIn.toString()) {
    localStorage.setItem(tokenKey, action.payload.token);
  } else if (action.type === authSlice.actions.loggedOut.toString()) {
    localStorage.removeItem(tokenKey);
  }

  return next(action);
};

export default authSlice.reducer;
export const { loggedIn, loggedOut } = authSlice.actions;
