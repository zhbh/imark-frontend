import { EventType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const getEvents = (
    params: Partial<Pick<EventType, "title" | "content">> & {
        current?: number;
        pageSize?: number;
        all?: boolean;
    }
) => {
    return request.get(`/api/event?${qs.stringify(params)}`);
};

export const addEvent = (params: EventType) => {
    return request.post("/api/event", params);
};

export const updateEVent = (id: string, params: EventType) => {
    return request.put(`/api/event/${id}`, params);
};

export const getEventDetail = (id: string) => {
    return request.get(`/api/event/${id}`);
};

export const deleteEvent = (id: string) => {
    return request.delete(`/api/event/${id}`);
};