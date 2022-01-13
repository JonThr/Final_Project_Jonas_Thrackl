import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { TrackingEntry } from '../../models/trackingEntry.model';

@controller('/tracking')
@injectable()
export class TrackingEntriesController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService
  ) {}

  @httpPost('/')
  public addTrackingEntry(request: Request, response: Response): void {
      this.databaseService.checkIn(request.body);
  }
}