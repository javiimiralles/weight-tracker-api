import mongoose from 'mongoose';

export const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log('Conexión establecida con la base de datos');
    } catch (error) {
        console.error(error);
        throw new Error('Error estableciendo conexión con la base de datos');
    }
}

