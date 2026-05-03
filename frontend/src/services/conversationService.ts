import api from "../utils/axios";
import type { Conversation } from "../types/types";

export const fetchConversationsByUserId = async (id: string): Promise<Conversation[]> => {
    const res = await api.get(`/conversation/user/${id}`);
    return res.data;
}