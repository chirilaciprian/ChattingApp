import api from "../utils/axios";
import type { Conversation, UpdateConversationDto } from "../types/types";

export const fetchConversationsByUserId = async (id: string): Promise<Conversation[]> => {
    const res = await api.get(`/conversation/user/${id}`);
    return res.data;
}

export const fetchConversationById = async (id: string): Promise<Conversation> => {
    const res = await api.get(`/conversation/${id}`);
    return res.data;
}

export const updateConversation = async (id: string, data: UpdateConversationDto): Promise<Conversation> => {
    const res = await api.patch(`/conversation/${id}`, data);
    return res.data;
}