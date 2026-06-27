import pool from '../database/connection';
import { Hero, CreateHeroDTO, UpdateHeroDTO, HeroListQuery, PaginatedResult } from '../types/hero';
import { v4 as uuidv4 } from 'uuid';

export class HeroRepository {
  async findAll(query: HeroListQuery): Promise<PaginatedResult<Hero>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';

    let whereClause = '';
    const params: (string | number)[] = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR nickname LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countRows] = await pool.execute<any[]>(
      `SELECT COUNT(*) as total FROM heroes ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.execute<any[]>(
      `SELECT * FROM heroes ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      data: rows.map(this.mapRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Hero | null> {
    const [rows] = await pool.execute<any[]>('SELECT * FROM heroes WHERE id = ?', [id]);
    return rows.length > 0 ? this.mapRow(rows[0]) : null;
  }

  async create(dto: CreateHeroDTO): Promise<Hero> {
    const id = uuidv4();
    await pool.execute(
      `INSERT INTO heroes (id, name, nickname, date_of_birth, universe, main_power, avatar_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, dto.name, dto.nickname, dto.date_of_birth, dto.universe, dto.main_power, dto.avatar_url]
    );
    return this.findById(id) as Promise<Hero>;
  }

  async update(id: string, dto: UpdateHeroDTO): Promise<Hero | null> {
    const fields = Object.entries(dto)
      .filter(([_, v]) => v !== undefined)
      .map(([k]) => `${k} = ?`);
    const values = Object.values(dto).filter((v) => v !== undefined);

    if (fields.length === 0) return this.findById(id);

    await pool.execute(
      `UPDATE heroes SET ${fields.join(', ')} WHERE id = ? AND is_active = 1`,
      [...values, id]
    );
    return this.findById(id);
  }

  async activate(id: string): Promise<Hero | null> {
    await pool.execute('UPDATE heroes SET is_active = 1 WHERE id = ?', [id]);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.execute<any>('DELETE FROM heroes WHERE id = ? AND is_active = 1', [id]);
    return result.affectedRows > 0;
  }

  private mapRow(row: any): Hero {
    const fmt = (d: any) => {
      if (!d) return '';
      const date = new Date(d);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    return {
      id: row.id,
      name: row.name,
      nickname: row.nickname,
      date_of_birth: fmt(row.date_of_birth),
      universe: row.universe,
      main_power: row.main_power,
      avatar_url: row.avatar_url,
      is_active: Boolean(row.is_active),
      created_at: fmt(row.created_at),
      updated_at: fmt(row.updated_at),
    };
  }
}

export const heroRepository = new HeroRepository();
