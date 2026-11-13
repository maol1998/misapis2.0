import mongoose from 'mongoose';
import connectDB from '../config/database.js';

let isConnected = false;

const conectarAMongoDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }
    await connectDB();
    isConnected = true;
};

export { conectarAMongoDB, isConnected, isConnected as isConected };
export default connectDB;
