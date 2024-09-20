import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbConnection } from './database/config.js';
import 'dotenv/config';

const app = express();
dbConnection();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.json());

app.listen(process.env.PORT, '0.0.0.0', ()=>{
    console.log('Servidor escuchando en el puerto: ' + process.env.PORT);
});