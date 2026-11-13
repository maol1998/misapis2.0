import mongoose from 'mongoose';
import 'colors';

/**
 * Conexión a la base de datos MongoDB utilizando Mongoose
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`.green.bold);
        return conn;
    } catch (error) {
        console.error(`Error al conectar a MongoDB: ${error.message}`.red.bold);
        process.exit(1);
    }
};

export default connectDB;
