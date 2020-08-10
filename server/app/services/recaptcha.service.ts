import * as dotenv from 'dotenv';
import * as https from 'https';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { RecaptchaValidation } from '../../../common/communication/recaptcha-validation';

@injectable()
export class ReCaptchaService {
  private options: https.RequestOptions;

  constructor() {
    dotenv.config();
  }

  async validateReCaptchaToken(token: string): Promise<RecaptchaValidation> {
    this.options = {
      host: process.env.RECAPTCHA_HOST,
      path: `${process.env.RECAPTCHA_PATH}?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      method: 'POST',
    };
    return new Promise((resolve, reject) => {
      let reCaptchaValidation = '';
      const req = https.request(this.options, (res) => {
        res.on('data', (data) => {
          reCaptchaValidation += data;
        });
        res.on('end', () => {
          const reCaptchaValidationObject = JSON.parse(reCaptchaValidation);
          if (reCaptchaValidationObject.success) {
            resolve({ success: true, message: 'Token successfully validated.' });
          } else {
            const errorCodes: string[] | undefined = reCaptchaValidationObject['error-codes'];
            const errorToSend = new Error();
            errorToSend.name = 'ReCaptchaValidationError';
            errorCodes
              ? (errorToSend.message = `Token validation failed. Error codes: ${errorCodes.toString()}`)
              : (errorToSend.message = 'Token validation failed.');
            reject(errorToSend);
          }
        });
      });
      req.on('error', (error: Error) => {
        const errorToSend = new Error();
        errorToSend.name = 'InternalServerError';
        errorToSend.message = `Connection to google server failed: ${error.message}`;
        reject(errorToSend);
      });
      req.end();
    });
  }
}
