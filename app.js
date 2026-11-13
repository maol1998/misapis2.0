import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';

const app = express();

// ==========================================
// Middlewares Globales
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Ruta raíz del Backend (Health Check & Info)
// ==========================================
app.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'API REST - Distribuidora y Exportadora de Mariscos "El Puerto" (Esmeraldas)',
        puerto: 'Puerto Pesquero Artesanal de Esmeraldas, Ecuador',
        version: '1.0.0',
        rutas: {
            mariscos: '/api/mariscos',
            semilla: '/api/mariscos/seed'
        }
    });
});

// ==========================================
// Rutas de la API (/api/mariscos)
// ==========================================
app.use('/api', indexRoutes);

// ==========================================
// Manejador de Rutas No Encontradas (404)
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        msg: 'Ruta no encontrada en el backend',
        sugerencia: 'Consulte /api/mariscos para ver los recursos disponibles'
    });
});

// ==========================================
// Manejador Global de Errores (500)
// ==========================================
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({
        ok: false,
        msg: 'Error interno en el servidor',
        error: err.message
    });
});

export default app;
