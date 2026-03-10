import mongoose from 'mongoose';

export async function connectDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI manquant dans .env');
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB !');
    } catch (err) {
        if (err.cause?.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
            throw new Error('MongoDB ne répond pas sur ' + process.env.MONGODB_URI + ' — démarre MongoDB (mongod) ou utilise une URI Atlas.');
        }
        throw err;
    }
}