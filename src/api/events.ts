import { EventType } from "@/types";
import request from "@/utils/request";

export const addEvent = (params: EventType) => {
    return request.post("/api/addEvent", params);
};