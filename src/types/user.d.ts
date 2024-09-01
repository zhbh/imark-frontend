import { ValueOf } from "next/dist/shared/lib/constants";

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user",
}

export enum USER_STATUS {
  ON = "on",
  OFF = "off",
}

export enum USER_SEX {
  MALE = "male",
  FEMALE = "female",
}

export enum BORROW_STATUS {
  ON = "on",
  OFF = "off",
}

export interface UserType {
  nickName: string;
  _id?: string;
  name: string;
  role: USER_ROLE;
  status: USER_STATUS;
  sex: USER_SEX;
}

export interface UserLoginType {
  name: string;
  password: string;
}

export interface UserQueryType {
  current?: number;
  pageSize?: number;
  name?: string;
  all?: boolean;
  status?: USER_STATUS;
}

export interface UserFormProps {
  title: string;
  editData?: UserType;
}
