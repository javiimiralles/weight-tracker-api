import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbConnection } from './database/config.js';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import weightRecordsRoutes from './routes/weight-records.routes.js';

const app = express();
dbConnection();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/login', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/weight-records', weightRecordsRoutes);

app.listen(process.env.PORT, '0.0.0.0', ()=>{
    console.log('Servidor escuchando en el puerto: ' + process.env.PORT);
});