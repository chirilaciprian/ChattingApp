import api from "../utils/axios";
import type { User } from "../types/types";

export const searchUserByUsername = async (username: string): Promise<User[]> => {
    const res = await api.get(`/user/username/${username}`);
    return res.data;
}