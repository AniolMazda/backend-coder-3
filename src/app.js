import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import {dbConnection,PORTDB} from './utils/dbConnection.js';
import mocksRouter from './routes/mocks.router.js'
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import pathHandler from "./middlewares/pathHandler.mid.js";
import errorHandler from "./middlewares/errorHandler.mid.js";

const app = express();
dbConnection();

app.listen(PORTDB,()=>console.log(`Listening on ${PORTDB}`))

app.use(express.json());
app.use(cookieParser());

app.use('/api/mocks',mocksRouter);
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use(errorHandler);
app.use(pathHandler);

export default app;
