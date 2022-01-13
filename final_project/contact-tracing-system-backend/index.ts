import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import { DatabaseService } from './core/services/database.service';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Application } from 'express';

export const container = new IoContainer();
container.init();

export const logger = container.getContainer().resolve(LoggerService);
export const databaseService = container.getContainer().resolve(DatabaseService);

export const server = new InversifyExpressServer(container.getContainer());

const initServerConfiguration = (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
};

databaseService.initialize().then(() => {
    server.setConfig(initServerConfiguration);
    const app = server.build();

    app.listen(9999);
    logger.info('Server listening on port 9999');
}).catch((error) => {
    logger.error(error, 'Error while starting express server');
    process.exit(-1);
})