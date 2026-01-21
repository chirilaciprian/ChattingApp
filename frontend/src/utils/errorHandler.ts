import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        if (Array.isArray(serverMessage)) {
            return serverMessage[0];
        }
        return serverMessage || "An error occurred with the request";
    }
    return "Unexpected error occurred";
}