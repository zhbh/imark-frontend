import { CategoryType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const getCategories = () => {
  return request.get(`/api/category`);
};

export const addCategory = (params: CategoryType) => {
  return request.post("/api/category", params);
};

export const updateCategory = (id: string, params: CategoryType) => {
  return request.put(`/api/category/${id}`, params);
};

export const deleteCategory = (id: string) => {
  return request.delete(`/api/category/${id}`);
};