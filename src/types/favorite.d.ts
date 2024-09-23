import { CategoryType } from "./category";
import { EventType } from "./event";

export interface FavoriteType {
  _id?: string;
  user: UserType;
  event: EventType;
}

export interface FavoriteQueryType {
  title?: string;
  category?: CategoryType;
}