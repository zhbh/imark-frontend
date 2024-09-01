import { UserType } from "@/types";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const obj = localStorage.getItem("user");
    if (obj) {
      console.log("🚀 ~ useEffect ~ obj:", obj)
      setUser(JSON.parse(obj));
    }
  }, []);

  return user;
};
