import api from "../utils/axios";
import type { Message } from "../types/types";

export const fetchMessagesByConversationId = async (conversationId: string): Promise<Message[]> => {
    const res = await api.get(`/message/conversation/${conversationId}`);
    return res.data;
}