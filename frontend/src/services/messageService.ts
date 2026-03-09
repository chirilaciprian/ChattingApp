import api from "../utils/axios";
import type { Message } from "../types/types";

export const fetchMessagesByConversationId = async (conversationId: string): Promise<Message[]> => {
    const res = await api.get(`/messages/conversation/${conversationId}`);
    return res.data;
}

export const deleteMessage = async (messageId: string): Promise<Message> => {
    const res = await api.delete(`/messages/${messageId}`);
    return res.data;
}