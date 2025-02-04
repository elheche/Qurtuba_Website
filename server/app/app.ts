import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import { DatabaseController } from './controllers/database.controller';
import { DateController } from './controllers/date.controller';
import { IndexController } from './controllers/index.controller';
import { ReCaptchaController } from './controllers/recaptcha.controller';
import Types from './types';

@injectable()
export class Application {
  private readonly internalError: number = 500;
  app: express.Application;

  constructor(
    @inject(Types.IndexController) private indexController: IndexController,
    @inject(Types.DateController) private dateController: DateController,
    @inject(Types.DatabaseController) private databaseController: DatabaseController,
    @inject(Types.ReCaptchaController) private reCaptchaController: ReCaptchaController,
  ) {
    this.app = express();

    this.config();

    this.bindRoutes();
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors());

    dotenv.config();
  }

  bindRoutes(): void {
    // Notre application utilise le routeur de notre API `Index`
    this.app.use('/api/index', this.indexController.router);
    this.app.use('/api/date', this.dateController.router);
    this.app.use('/api/database', this.databaseController.router);
    this.app.use('/api/recaptcha', this.reCaptchaController.router);
    this.errorHandling();
  }

  private errorHandling(): void {
    // When previous handlers have not served a request: path wasn't found
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const err: Error = new Error('Not Found');
      next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
      // tslint:disable-next-line:no-any
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || this.internalError);
        res.send({
          message: err.message,
          error: err.stack,
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    // tslint:disable-next-line:no-any
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || this.internalError);
      res.send({
        message: err.message,
        error: {},
      });
    });
  }
}
