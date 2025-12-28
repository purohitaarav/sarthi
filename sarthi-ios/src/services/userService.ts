import api from './api';

export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password?: string;
}

export const userService = {
    async getUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    async createUser(request: CreateUserRequest): Promise<User> {
        const response = await api.post<User>('/users', request);
        return response.data;
    },

    async deleteUser(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    },
};
