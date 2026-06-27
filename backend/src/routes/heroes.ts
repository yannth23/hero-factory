import { Router } from 'express';
import { heroController } from '../controllers/heroController';

const router = Router();

router.get('/', (req, res, next) => heroController.list(req, res, next));
router.get('/:id', (req, res, next) => heroController.getOne(req, res, next));
router.post('/', (req, res, next) => heroController.create(req, res, next));
router.put('/:id', (req, res, next) => heroController.update(req, res, next));
router.patch('/:id/activate', (req, res, next) => heroController.activate(req, res, next));
router.delete('/:id', (req, res, next) => heroController.remove(req, res, next));

export default router;
