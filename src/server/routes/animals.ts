import { Router, Request, Response } from 'express';
import { AnimalManager, CreateAnimalDto, UpdateAnimalDto } from '../../modules/AnimalManager';
import { AnimalSpecies, AnimalStatus } from '../../assistant/types';

export function createAnimalsRouter(manager: AnimalManager): Router {
  const router = Router();

  /**
   * POST /api/animals
   * Registers a new animal in the herd.
   */
  router.post('/', (req: Request, res: Response) => {
    const dto = req.body as CreateAnimalDto;
    if (!dto.name || !dto.species || !dto.breed || !dto.sex || !dto.birthDate || dto.weight == null) {
      res.status(400).json({ error: 'Campos requeridos: name, species, breed, sex, birthDate, weight.' });
      return;
    }
    const animal = manager.create({ ...dto, birthDate: new Date(dto.birthDate) });
    res.status(201).json(animal);
  });

  /**
   * GET /api/animals
   * Lists animals, optionally filtered by species or status query params.
   */
  router.get('/', (req: Request, res: Response) => {
    const { species, status } = req.query as { species?: AnimalSpecies; status?: AnimalStatus };
    const animals = manager.findAll(species, status);
    res.json({ total: animals.length, animals });
  });

  /**
   * GET /api/animals/stats
   * Returns herd summary statistics.
   */
  router.get('/stats', (_req: Request, res: Response) => {
    res.json(manager.getStats());
  });

  /**
   * GET /api/animals/:id
   * Returns a single animal by ID.
   */
  router.get('/:id', (req: Request, res: Response) => {
    const animal = manager.findById(req.params.id);
    if (!animal) {
      res.status(404).json({ error: 'Animal no encontrado.' });
      return;
    }
    res.json(animal);
  });

  /**
   * PATCH /api/animals/:id
   * Updates an existing animal's fields.
   */
  router.patch('/:id', (req: Request, res: Response) => {
    const updated = manager.update(req.params.id, req.body as UpdateAnimalDto);
    if (!updated) {
      res.status(404).json({ error: 'Animal no encontrado.' });
      return;
    }
    res.json(updated);
  });

  /**
   * DELETE /api/animals/:id
   * Removes an animal from the registry.
   */
  router.delete('/:id', (req: Request, res: Response) => {
    const deleted = manager.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Animal no encontrado.' });
      return;
    }
    res.status(204).send();
  });

  return router;
}
