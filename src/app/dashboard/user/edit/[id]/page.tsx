"use client";

import { getUserDetail } from "@/api";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const UserForm = dynamic(() => import("@/components/user_form"), { ssr: false, });

export default function EditUser() {
  const [data, setData] = useState();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const data = pathname.split("/").pop();

      const res = await getUserDetail(data as string);
      setData(res.data);
    })();
  }, [pathname]);

  return <UserForm title="Edit User" editData={data} />;
};