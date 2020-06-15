import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

@injectable()
export class DatabaseController {
  router: Router;

  constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService
        .getAllDrawings()
        .then((users: mongoose.Document[]) => {
          res.json(users);
        })
        .catch((error: string) => {
          res.status(Httpstatus.NOT_FOUND).send(error);
        });
    });
  }
}
