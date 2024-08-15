export interface EventType {
    _id?: string
    title: string;
    content: string;
    contact: string;
    category: string;
    expirationTime: number;
    dispatchTime: number;
    location: string;
}

export interface EventFormType {
    title: string;
    editData?: EventType;
}