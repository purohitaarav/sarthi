import api from './api';

export interface Reflection {
    id: number;
    user_id?: string;
    reflection_text: string;
    verse_id?: string | number;
    chapter_id?: string | number;
    created_at: string;
}

export interface CreateReflectionRequest {
    reflection_text: string;
    verse_id?: string | number;
    chapter_id?: string | number;
}

export const reflectionService = {
    async getReflections(): Promise<Reflection[]> {
        const response = await api.get<Reflection[]>('/reflections');
        return response.data;
    },

    async createReflection(request: CreateReflectionRequest): Promise<Reflection> {
        const response = await api.post<Reflection>('/reflections', request);
        return response.data;
    },

    async deleteReflection(id: number): Promise<void> {
        await api.delete(`/reflections/${id}`);
    },
};
