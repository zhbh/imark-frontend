
"use client";

import { getEventDetail } from "@/api";
import { EventForm } from "@/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditEvent() {
  const [data, setData] = useState();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const data = pathname.split("/").pop();
      console.log("🚀 ~ EditEvent ~ pathname:", data)

      const res = await getEventDetail(data as string);
      console.log("🚀 ~ res:", res)

      setData(res.data);
    })();

  }, [pathname]);

  return <EventForm title="Edit Event" editData={data} />;
}
