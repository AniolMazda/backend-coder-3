import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import swaggerUI from "swagger-ui-express"
import swaggerJSDoc from 'swagger-jsdoc';
import {dbConnection,PORTDB} from './utils/dbConnection.js';
import mocksRouter from './routes/mocks.router.js'
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import addLogger from './middlewares/logger.mid.js';
import pathHandler from "./middlewares/pathHandler.mid.js";
import errorHandler from "./middlewares/errorHandler.mid.js";

const app = express();
dbConnection();

app.listen(PORTDB,()=>console.log(`Listening on ${PORTDB}`))

app.use(express.json());
app.use(cookieParser());

const swaggerConfig = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"API AdoptMe",
            version:"1.0.0",
            description:"API-REST Documetation for AdoptMe"
        },
        servers:[
            {
                url:"http://localhost:8080",
                description:"Development"
            }
        ]
    },
    apis:["./src/docs/*.yaml"],
}

const swaggerDocs = swaggerJSDoc(swaggerConfig)
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(addLogger);
app.use('/api/mocks',mocksRouter);
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use(errorHandler);
app.use(pathHandler);

export default app;
