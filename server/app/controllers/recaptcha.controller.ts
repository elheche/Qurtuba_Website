import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { RecaptchaValidation } from '../../../common/communication/recaptcha-validation';
import { ReCaptchaService } from '../services/recaptcha.service';
import Types from '../types';

@injectable()
export class ReCaptchaController {
  router: Router;

  constructor(@inject(Types.ReCaptchaService) private reCaptchaService: ReCaptchaService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();
    this.router.post('/token-validation', async (req: Request, res: Response, next: NextFunction) => {
      this.reCaptchaService
        .validateReCaptchaToken(req.body.token)
        .then((recaptchaValidation: RecaptchaValidation) => {
          res.status(Httpstatus.OK).json(recaptchaValidation);
        })
        .catch((error: Error) => {
          error.name === 'ReCaptchaValidationError'
            ? res.status(Httpstatus.BAD_REQUEST).json(error)
            : res.status(Httpstatus.INTERNAL_SERVER_ERROR).json(error);
        });
    });
  }
}
