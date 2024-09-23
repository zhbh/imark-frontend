import request from "@/utils/request";
import qs from "qs";

import { CategoryType, EventType, FavoriteQueryType, FavoriteType } from "./../types";

export const getFavorites = (
  params: Partial<Pick<EventType, "title" | "content" | "category">> & {
      current?: number;
      pageSize?: number;
      all?: boolean;
      category?: CategoryType;
  }
) => {
  return request.get(`/api/favorite?${qs.stringify(params)}`);
};

export const getFavorite = (id: string) => {
  return request.get(`/api/favorite/${id}`);
};

export const addFavorite = (params: FavoriteType) => {
  return request.post(`/api/favorite`, params);
};

export const deleteFavorite = (id: string) => {
  return request.delete(`/api/favorite/${id}`);
};
