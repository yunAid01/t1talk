import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../store";

interface LoginUser {
  email: string;
  nickname: string;
  id: number;
  createdAt: string;
  statusMessage?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
}
export interface AuthState {
  user: LoginUser | null;
  token: string | null;
}

// 새로고침 후에도 로그인 상태를 유지하기 위해 로컬 스토리지에서 토큰을 불러옵니다.
// localStorage에서 초기 상태 복원
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
    };
  }
  const savedUser = localStorage.getItem("login_user");
  const token = localStorage.getItem("access_token");
  if (savedUser && token) {
    return {
      user: JSON.parse(savedUser),
      token,
    };
  }
  return {
    user: null,
    token: null,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: LoginUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("login_user", JSON.stringify(action.payload.user));
      localStorage.setItem("access_token", action.payload.token);
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("access_token");
    },
  },
});

export default authSlice.reducer;

//action
export const { setCredentials, clearCredentials } = authSlice.actions;

//selector
export const selectCurrentUser = (state: AppState) => state.auth.user;
export const selectCurrentToken = (state: AppState) => state.auth.token;
