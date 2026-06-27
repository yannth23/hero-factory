import { heroRepository } from '../repositories/heroRepository';
import { CreateHeroDTO, UpdateHeroDTO, HeroListQuery } from '../types/hero';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nome de guerra é obrigatório'),
  date_of_birth: z.string().min(1, 'Data de nascimento é obrigatória'),
  universe: z.string().min(1, 'Universo é obrigatório'),
  main_power: z.string().min(1, 'Habilidade principal é obrigatória'),
  avatar_url: z.string().url('URL do avatar inválida'),
});

const updateSchema = createSchema.partial();

export class HeroService {
  async listHeroes(query: HeroListQuery) {
    return heroRepository.findAll(query);
  }

  async getHero(id: string) {
    const hero = await heroRepository.findById(id);
    if (!hero) throw { status: 404, message: 'Herói não encontrado' };
    return hero;
  }

  async createHero(dto: CreateHeroDTO) {
    const parsed = createSchema.safeParse(dto);
    if (!parsed.success) {
      throw { status: 400, message: parsed.error.errors[0].message };
    }
    return heroRepository.create(parsed.data);
  }

  async updateHero(id: string, dto: UpdateHeroDTO) {
    const hero = await heroRepository.findById(id);
    if (!hero) throw { status: 404, message: 'Herói não encontrado' };
    if (!hero.is_active) throw { status: 400, message: 'Não é possível editar um herói desativado' };

    const parsed = updateSchema.safeParse(dto);
    if (!parsed.success) {
      throw { status: 400, message: parsed.error.errors[0].message };
    }
    return heroRepository.update(id, parsed.data);
  }

  async activateHero(id: string) {
    const hero = await heroRepository.findById(id);
    if (!hero) throw { status: 404, message: 'Herói não encontrado' };
    if (hero.is_active) throw { status: 400, message: 'Herói já está ativo' };
    return heroRepository.activate(id);
  }

  async deleteHero(id: string) {
    const hero = await heroRepository.findById(id);
    if (!hero) throw { status: 404, message: 'Herói não encontrado' };
    if (!hero.is_active) throw { status: 400, message: 'Não é possível excluir um herói desativado. Use a opção de ativar primeiro.' };
    const deleted = await heroRepository.delete(id);
    if (!deleted) throw { status: 400, message: 'Erro ao excluir herói' };
  }
}

export const heroService = new HeroService();
