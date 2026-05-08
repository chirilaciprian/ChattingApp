import api from "../utils/axios";
import type { Participant, CreateParticipantDto, UpdateParticipantDto } from "../types/types";

export const addParticipantToConversation = async (dto: CreateParticipantDto): Promise<Participant> => {
    console.log("DTO:", dto);
    const res = await api.post('/participant', dto);
    return res.data;
}

export const removeParticipantFromConversation = async (participantId: string): Promise<Participant> => {
    const res = await api.delete(`/participant/${participantId}`);
    return res.data;
}

export const updateParticipant = async (id: string, dto: UpdateParticipantDto): Promise<Participant> => {
    const res = await api.patch(`/participant/${id}`, dto);
    return res.data;
}
