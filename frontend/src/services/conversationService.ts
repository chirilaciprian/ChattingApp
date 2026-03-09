import api from "../utils/axios";
import type { Conversation } from "../types/types";

export const fetchConversationsByUserId = async (id: string): Promise<Conversation[]> => {
    const res = await api.get(`/conversations/user/${id}`);
    return res.data;
}

export const deleteConversation = async (id: string): Promise<Conversation> => {
    const res = await api.delete(`/conversations/${id}`);
    return res.data;
}

export const createConversation = async (firstUserId: string, secondUserId: string): Promise<Conversation> => {
    const res = await api.post(`/conversations`, { firstUserId, secondUserId });
    return res.data;
}