import { UserQueryType, UserType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const setLogout = async () => {
  await request.get(`/api/logout`);
};

export const getUserList = (params?: UserQueryType) => {
  return request.get(`/api/users?${qs.stringify(params)}`);
};

export const getUserDetail = (id: string) => {
  return request.get(`/api/users/${id}`);
};

export const deleteUser = (id: string) => {
  return request.delete(`/api/users/${id}`);
};

export const addUser = (params: UserType) => {
  return request.post("/api/users", params);
};

export const updateUser = (id: string, params: UserType) => {
  return request.put(`/api/users/${id}`, params);
};
