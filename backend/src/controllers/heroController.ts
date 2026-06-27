import { Request, Response, NextFunction } from 'express';
import { heroService } from '../services/heroService';

export class HeroController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await heroService.listHeroes({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search as string,
      });
      res.json(result);
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.getHero(req.params.id);
      res.json(hero);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.createHero(req.body);
      res.status(201).json(hero);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.updateHero(req.params.id, req.body);
      res.json(hero);
    } catch (err) { next(err); }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.activateHero(req.params.id);
      res.json(hero);
    } catch (err) { next(err); }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await heroService.deleteHero(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

export const heroController = new HeroController();
