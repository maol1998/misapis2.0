import { Router } from 'express';
import mariscosRoutes from './mariscos.routes.js';

const indexRoutes = Router();

// Ruta oficial: Distribuidora y Exportadora de Mariscos "El Puerto" (Esmeraldas)
indexRoutes.use('/mariscos', mariscosRoutes);

// Alias para mantener compatibilidad con cualquier petición a /api/ejemplo
indexRoutes.use('/ejemplo', mariscosRoutes);

export default indexRoutes;
