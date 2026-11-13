import express from 'express';
import cors from 'cors';
import indexRoutes from '../routes/index.routes.js';
import * as db from '../db/cnn_mongodb.js';

export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.generalRoute = '/api';

        // Conectar a la base de datos MongoDB
        this.conectarDBMongo();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDBMongo() {
        if (!db.isConnected) {
            await db.conectarAMongoDB();
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body a JSON
        this.app.use(express.json());

        // Directorio público (Panel web interactivo y documentación)
        this.app.use(express.static('public'));
    }

    routes() {
        // Rutas principales de la API: /api/mariscos
        this.app.use(this.generalRoute, indexRoutes);

        // Manejador de rutas no encontradas
        this.app.use((req, res) => {
            res.status(404).json({
                ok: false,
                msg: 'Ruta no encontrada en la API',
                sugerencia: 'Visite /api/mariscos para consultar los lotes de mariscos de Esmeraldas'
            });
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('\n======================================================'.cyan);
            console.log('🐟 DISTRIBUIDORA Y EXPORTADORA DE MARISCOS "EL PUERTO"'.bold.cyan);
            console.log('📍 Puerto Pesquero Artesanal de Esmeraldas - Ecuador'.gray);
            console.log('======================================================'.cyan);
            console.log('🚀 Servidor corriendo en puerto:', `${this.port}`.yellow.bold);
            console.log('🌐 Panel web interactivo:        ', `http://localhost:${this.port}/`.blue);
            console.log('📦 API Lotes de Mariscos:        ', `http://localhost:${this.port}/api/mariscos`.green);
            console.log('======================================================\n'.cyan);
        });
    }
}
