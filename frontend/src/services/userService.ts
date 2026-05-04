import api from "../utils/axios";
import type { User } from "../types/types";

export const searchUserByUsername = async (username: string): Promise<User[]> => {
    const res = await api.get(`/user/username/${username}`);
    return res.data;
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.patch(`/user/${id}`, data);
    return res.data;
}