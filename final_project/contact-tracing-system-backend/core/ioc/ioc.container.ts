import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { LoggerService } from '../services/logger.service';
import { DatabaseService } from '../services/database.service';
import { EntriesController } from '../../api/events/entries.controller';
import { AdminsController } from '../../api/events/admins.controller';
import { TrackingEntriesController } from '../../api/events/tracking-entries.controller';

export class IoContainer {
  private container = new Container();

  public init(): void {
    this.initServices();
    this.initController();
  }

  public getContainer(): Container {
    return this.container;
  }

  private initController(): void {
    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(EntriesController)
    .whenTargetNamed(EntriesController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(AdminsController)
    .whenTargetNamed(AdminsController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(TrackingEntriesController)
    .whenTargetNamed(TrackingEntriesController.name);
  }

  private initServices(): void {
    this.container
      .bind<LoggerService>(LoggerService.name)
      .to(LoggerService)
      .inSingletonScope();
      this.container
      .bind<DatabaseService>(DatabaseService.name)
      .to(DatabaseService)
      .inSingletonScope();
  }
}
