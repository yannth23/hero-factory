export interface Hero {
  id: string;
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHeroDTO {
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
}

export interface UpdateHeroDTO extends Partial<CreateHeroDTO> {}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
