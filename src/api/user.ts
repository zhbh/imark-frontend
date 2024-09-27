import { UserQueryType, UserType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const setLogout = async () => {
  await request.get(`/api/logout`);
};

export const getUserList = (params?: UserQueryType) => {
  return request.get(`/api/user?${qs.stringify(params)}`);
};

export const getUserDetail = (id: string) => {
  return request.get(`/api/user/${id}`);
};

export const deleteUser = (id: string) => {
  return request.delete(`/api/user/${id}`);
};

export const addUser = (params: UserType) => {
  return request.post("/api/user", params);
};

export const updateUser = (id: string, params: UserType) => {
  return request.put(`/api/user/${id}`, params);
};
