import { UserType } from "./user";

export interface EventType {
    _id?: string
    title: string;
    content: string;
    contact: string;
    category: string;
    expirationTime: number;
    dispatchTime: number;
    location: string;
    user: UserType;
}

export interface EventFormType {
    title: string;
    editData?: EventType;
}