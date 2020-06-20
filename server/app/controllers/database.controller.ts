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
      this.databaseService.getAllUsers()
        .then((users: mongoose.Document[]) => {
          res.json(users);
        })
        .catch((error: mongoose.Error) => {
          res.status(Httpstatus.NOT_FOUND).send(error.message);
        });
    });

    this.router.get('/login', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService.getUser(req.body)
        .then((user: mongoose.Document) => {
          res.json(user);
        })
        .catch((error: mongoose.Error) => {
          if (error.message === 'Invalid email.' || error.message === 'Invalid password.') {
            res.status(Httpstatus.UNAUTHORIZED).send(error.message);
          } else {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          }
        });
    });

    this.router.post('/registration', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService.addUser(req.body)
        .then((registredUser: mongoose.Document) => {
          res.status(Httpstatus.CREATED).send(registredUser);
        })
        .catch((error: mongoose.Error) => {
          res.status(Httpstatus.NOT_ACCEPTABLE).send(error.message);
        });
    });

    this.router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService.deleteUser(req.params.id)
        .then((deletedUser: mongoose.Document) => {
          res.status(Httpstatus.OK).send(deletedUser);
        })
        .catch((error: mongoose.Error) => {
          res.status(Httpstatus.NOT_FOUND).send(error.message);
        });
    });
  }
}
