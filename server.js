import 'dotenv/config';
import 'colors';
import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos MongoDB
connectDB();

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log('\n======================================================'.cyan);
    console.log('🐟 DISTRIBUIDORA Y EXPORTADORA DE MARISCOS "EL PUERTO"'.bold.cyan);
    console.log('📍 Puerto Pesquero Artesanal de Esmeraldas - Ecuador'.gray);
    console.log('======================================================'.cyan);
    console.log('🚀 Servidor Backend corriendo en puerto:', `${PORT}`.yellow.bold);
    console.log('📦 Endpoint API Mariscos:               ', `http://localhost:${PORT}/api/mariscos`.green);
    console.log('======================================================\n'.cyan);
});

// Manejo de cierres inesperados
process.on('unhandledRejection', (err) => {
    console.error(`Error no controlado: ${err.message}`.red);
    server.close(() => process.exit(1));
});

export default server;
