import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { UserEntry } from '../../models/userEntry.model';

@controller('/entries')
@injectable()
export class EntriesController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService
  ) {}

  @httpGet('/')
  public getEntries(request: Request, response: Response): void {
    this.databaseService.getAllEntries().then((result: Array<UserEntry>) => {
      response.json(result);
    });
  }

  @httpDelete('/')
  public deleteEntries(request: Request, response: Response): void {
    this.databaseService.deleteAllEntries();
  }

  @httpPost('/')
  public AddEntry(request: Request, response: Response): void {
      this.databaseService.addNewEntry(request.body);
  }

  @httpDelete('/:id/')
  public deleteEntry(request: Request, response: Response): void {
      this.databaseService.deleteEntry(request.params);
  }
}
