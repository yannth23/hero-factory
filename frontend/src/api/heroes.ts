import axios from 'axios';
import { Hero, CreateHeroDTO, UpdateHeroDTO, PaginatedResult } from '../types/hero';

const api = axios.create({ baseURL: '/api' });

export const heroesApi = {
  list: (params: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResult<Hero>>('/heroes', { params }).then(r => r.data),

  getOne: (id: string) =>
    api.get<Hero>(`/heroes/${id}`).then(r => r.data),

  create: (data: CreateHeroDTO) =>
    api.post<Hero>('/heroes', data).then(r => r.data),

  update: (id: string, data: UpdateHeroDTO) =>
    api.put<Hero>(`/heroes/${id}`, data).then(r => r.data),

  activate: (id: string) =>
    api.patch<Hero>(`/heroes/${id}/activate`).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/heroes/${id}`).then(r => r.data),
};
