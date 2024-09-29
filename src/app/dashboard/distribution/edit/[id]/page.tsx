
"use client";

import { getEventDetail } from "@/api";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const EventForm = dynamic(() => import("@/components/event_form"), { ssr: false, });

export default function EditEvent() {
  const [data, setData] = useState();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const data = pathname.split("/").pop();
      const res = await getEventDetail(data as string);

      setData(res.data);
    })();

  }, [pathname]);

  return <EventForm title="Edit Event" editData={data} />;
}
