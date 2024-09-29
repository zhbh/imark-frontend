"use client";

import { getUserDetail } from "@/api";
import { UserForm } from "@/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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