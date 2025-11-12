// apps/web/src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import modalReducer from "./features/modalSlice";

export const store = configureStore({
  devTools: true, // 개발자도구 활성화
  reducer: {
    auth: authReducer,
    modal: modalReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
