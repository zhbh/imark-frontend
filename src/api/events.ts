import { EventType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const getEvents = (
    params: {
        current?: number;
        pageSize?: number;
    }
) => {
    return request.get(`/api/event?${qs.stringify(params)}`);
};

export const addEvent = (params: EventType) => {
    return request.post("/api/event", params);
};