import { Router } from 'express';
import {
    getAllMariscos,
    getMariscoById,
    createMarisco,
    updateMarisco,
    deleteMarisco,
    seedMariscos
} from '../controllers/mariscos.controller.js';

const router = Router();

// Endpoint para recargar datos iniciales representativos de Esmeraldas
router.get('/seed', seedMariscos);

// CRUD principal de lotes de mariscos
router.get('/', getAllMariscos);
router.get('/:id', getMariscoById);
router.post('/', createMarisco);
router.put('/:id', updateMarisco);
router.delete('/:id', deleteMarisco);

export default router;
