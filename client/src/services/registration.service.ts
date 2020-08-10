import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecaptchaValidation } from '../../../common/communication/recaptcha-validation';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly RECAPTCHA_VALIDATION_URL: string;
  private httpOptions: {};

  constructor(private http: HttpClient) {
    this.RECAPTCHA_VALIDATION_URL = 'http://localhost:3000/api/recaptcha/token-validation';
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    };
  }

  sendToken(reCaptchaResponse: string): Observable<RecaptchaValidation> {
    return this.http
      .post<RecaptchaValidation>(this.RECAPTCHA_VALIDATION_URL, { token: reCaptchaResponse }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    const errorToThrow = new Error();
    if (error.error instanceof ErrorEvent) {
      errorToThrow.name = 'ClientOrNetworkError';
      errorToThrow.message = error.error.message;
      return throwError(errorToThrow);
    } else {
      errorToThrow.name = 'ServerError';
      errorToThrow.message = error.error.message ? error.error.message : error.message;
      return throwError(errorToThrow);
    }
  }
}
