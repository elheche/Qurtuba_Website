import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICountry } from 'src/app/registration/icountry';
import { environment } from 'src/environments/environment';
import { RecaptchaValidation } from '../../../common/communication/recaptcha-validation';
import data from '../assets/countries-data.json';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly RECAPTCHA_VALIDATION_URL: string;
  private httpOptions: {};
  countries: ICountry[];

  constructor(private http: HttpClient) {
    this.RECAPTCHA_VALIDATION_URL = 'http://localhost:3000/api/recaptcha/token-validation';
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    };
    this.countries = data as ICountry[];
  }

  sendToken(reCaptchaResponse: string): Observable<RecaptchaValidation> {
    return this.http
      .post<RecaptchaValidation>(this.RECAPTCHA_VALIDATION_URL, { token: reCaptchaResponse }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getErrorMessage(formGroup: FormGroup, input: string): string {
    return environment.inputs[input].errorMessages[Object.keys(formGroup.get(input).errors)[0]];
  }

  onPasswordValueChange(formGroup: FormGroup): void {
    formGroup.get('confirmPassword').reset();
  }

  formatPhoneNumber(event: InputEvent | FocusEvent, formGroup: FormGroup, input: string): void {
    if (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') {
      return;
    }

    const control: AbstractControl = formGroup.get(input);
    const countryIndex = this.findSelectedCountryIndex(formGroup);
    const regionCode = this.countries[countryIndex].countryShortCode;
    const regEx1 = /[^\d\(\)\-+ ]+/g;
    const inputValue = control.value as string;

    if (inputValue && regEx1.test(inputValue)) {
      control.setValue(inputValue.replace(regEx1, ''));
    }

    if (control.valid) {
      const phoneNumberUtil = PhoneNumberUtil.getInstance();
      try {
        const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(control.value, regionCode);
        regionCode === 'CA'
          ? control.setValue(phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL))
          : control.setValue(phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL));
      } catch (e) {
        return;
      }
    }
  }

  findSelectedCountryIndex(formGroup: FormGroup): number {
    return this.countries.findIndex((country) => country.countryName === formGroup.get('country').value);
  }

  formatCanadianPostalCode(event: InputEvent | FocusEvent, formGroup: FormGroup): void {
    if (
      (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') ||
      formGroup.get('country').value !== 'Canada'
    ) {
      return;
    }

    const control: AbstractControl = formGroup.get('postalCode');
    const regExTests = [
      /[^A-Za-z0-9 ]+/g,
      /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])[\- ]?(\d)$/i,
      /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])[\- ]?(\d[ABCEGHJ-NPRSTV-Z])$/i,
      /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])[\- ]?(\d[ABCEGHJ-NPRSTV-Z]\d)(.*)$/i,
    ];

    let postalCode = control.value as string;

    if (postalCode) {
      regExTests.forEach((regEx, index) => {
        if (index === 0) {
          postalCode = postalCode.replace(regEx, '');
        } else {
          postalCode = postalCode.replace(regEx, '$1 $2');
        }
      });
      control.setValue(postalCode.toUpperCase());
    }
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
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
