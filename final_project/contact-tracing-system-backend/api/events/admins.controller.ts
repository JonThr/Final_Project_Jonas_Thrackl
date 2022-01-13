import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { AdminEntry } from '../../models/adminEntry.model';

@controller('/admins')
@injectable()
export class AdminsController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService
  ) {}

  @httpGet('/')
  public getAdmins(request: Request, response: Response): void {
    this.databaseService.getAllAdmins().then((result: Array<AdminEntry>) => {
      response.json(result);
    });
  }

  @httpPost('/')
  public addAdmin(request: Request, response: Response): void {
      this.databaseService.addNewAdmin(request.body);
  }
}