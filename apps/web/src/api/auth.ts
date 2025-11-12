import apiClient from "./client";

// types
import {
  UserLoginInputType,
  UserLoginResponseType,
  UserCreateInputType,
  UserCreateResponseType,
} from "@repo/validation";

export const userLogin = async (
  loginData: UserLoginInputType
): Promise<UserLoginResponseType> => {
  const response: UserLoginResponseType = await apiClient.post(
    "/auth/login",
    loginData
  );
  return response;
};

export const userRegister = async (
  registerData: UserCreateInputType
): Promise<UserCreateResponseType> => {
  const response: UserCreateResponseType = await apiClient.post(
    "/auth/register",
    registerData
  );
  return response;
};
