"use client";

import { USER_ROLE } from "@/constants";
import { useCurrentUser } from "@/utils/user_info";
import { PropsWithChildren, cloneElement } from "react";

const Auth: React.FC<PropsWithChildren> = ({ children }) => {

  const user = useCurrentUser();
  return user?.role === USER_ROLE.ADMIN ? <>{children}</> : null;

};

export default Auth;
