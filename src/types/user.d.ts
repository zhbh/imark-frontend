import { ValueOf } from "next/dist/shared/lib/constants";

export interface UserType {
  nickName?: string;
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
