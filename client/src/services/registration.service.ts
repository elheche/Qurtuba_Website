import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { RecaptchaComponent } from 'ng-recaptcha';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { CustomValidators } from 'src/app/registration/custom-validators';
import { ICountry } from 'src/app/registration/icountry';
import { environment } from 'src/environments/environment';
import { RecaptchaValidation } from '../../../common/communication/recaptcha-validation';
import data from '../assets/countries-data.json';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService implements OnDestroy {
  private readonly RECAPTCHA_VALIDATION_URL: string;
  private httpOptions: {};
  private jointMemberStatusSource: BehaviorSubject<boolean>;
  private userAgreementTextSource: BehaviorSubject<string>;
  private subscriptions: Subscription[];
  countries: ICountry[];
  jointMemberStatus: Observable<boolean>;
  userAgreementText: Observable<string>;

  constructor(private http: HttpClient, private alertDialog: MatDialog, private snackBar: MatSnackBar) {
    this.RECAPTCHA_VALIDATION_URL = 'http://localhost:3000/api/recaptcha/token-validation';
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    };
    this.countries = data as ICountry[];
    this.subscriptions = [];
    this.jointMemberStatusSource = new BehaviorSubject<boolean>(false);
    this.jointMemberStatus = this.jointMemberStatusSource.asObservable();
    this.userAgreementTextSource = new BehaviorSubject<string>('');
    this.userAgreementText = this.userAgreementTextSource.asObservable();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
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

  onCountryValueChange(formGroup: FormGroup): void {
    let inputsTochange: string[];
    Object.keys(formGroup.value).includes('membershipType')
      ? (inputsTochange = ['city', 'province', 'postalCode', 'phoneNumber', 'employerPhoneNumber'])
      : (inputsTochange = ['city', 'province', 'postalCode']);

    if (formGroup.get('country').value) {
      const countryIndex = this.findSelectedCountryIndex(formGroup);
      const regionCode = this.countries[countryIndex].countryShortCode;
      const postalCodeRegEx = this.countries[countryIndex].postalCodeRegEx;

      inputsTochange.forEach((input) => {
        formGroup.get(input).reset();
        formGroup.get(input).enable({ onlySelf: true });
        switch (input) {
          case 'postalCode':
            formGroup.get('postalCode').setValidators([Validators.required, Validators.pattern(new RegExp(postalCodeRegEx))]);
            break;
          case 'phoneNumber':
            formGroup.get('phoneNumber').setValidators([Validators.required, CustomValidators.phoneNumberValidator(regionCode)]);
            break;
          case 'employerPhoneNumber':
            formGroup.get('employerPhoneNumber').setValidators([CustomValidators.phoneNumberValidator(regionCode)]);
            break;
        }
        formGroup.get(input).updateValueAndValidity({ onlySelf: true });
      });
    } else {
      inputsTochange.forEach((input) => {
        formGroup.get(input).reset();
        formGroup.get(input).disable({ onlySelf: true });
      });
    }
  }

  formatSocialInsuranceNumber(event: InputEvent | FocusEvent, formGroup: FormGroup): void {
    if (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') {
      return;
    }

    const control: AbstractControl = formGroup.get('socialInsuranceNumber');
    const regExTests = [
      /[^\d\-]+/g,
      /^(\d{3})[\- ]?(\d{1,3})$/,
      /^(\d{3})[\- ]?(\d{3})[\- ]?(\d{1,3})$/,
      /^(\d{3})[\- ]?(\d{3})[\- ]?(\d{3})(.*)$/,
    ];

    let socialInsuranceNumber = control.value as string;

    if (socialInsuranceNumber) {
      regExTests.forEach((regEx, index) => {
        if (index === 0) {
          socialInsuranceNumber = socialInsuranceNumber.replace(regEx, '');
        } else if (index === 1) {
          socialInsuranceNumber = socialInsuranceNumber.replace(regEx, '$1-$2');
        } else {
          socialInsuranceNumber = socialInsuranceNumber.replace(regEx, '$1-$2-$3');
        }
      });
      control.setValue(socialInsuranceNumber);
    }
  }

  onAccountTypeSelectionChange(mainHolderForm: FormGroup, jointMemberForm: FormGroup, doneForm?: FormGroup): void {
    let isEmpty = true;
    if (this.jointMemberStatusSource.getValue()) {
      const jointMemberFormValues = Object.values(jointMemberForm.value);
      for (const value of jointMemberFormValues) {
        if (value) {
          isEmpty = false;
          break;
        }
      }
    }
    const accountType = mainHolderForm.get('accountType').value;
    switch (accountType) {
      case 'Individual':
        if (isEmpty) {
          this.jointMemberStatusSource.next(false);
          if (doneForm) {
            doneForm.reset();
            this.userAgreementTextSource.next(environment.inputs.userAgreementStepDone.checkBoxText.individual);
          }
        } else {
          this.openAlertDialog(mainHolderForm, doneForm);
        }
        break;
      case 'Joint':
        jointMemberForm.reset();
        this.jointMemberStatusSource.next(true);
        if (doneForm) {
          doneForm.reset();
          this.userAgreementTextSource.next(environment.inputs.userAgreementStepDone.checkBoxText.joint);
        }
        break;
      default:
        if (isEmpty) {
          this.jointMemberStatusSource.next(false);
          if (doneForm) {
            doneForm.reset();
            this.userAgreementTextSource.next('');
          }
        } else {
          this.openAlertDialog(mainHolderForm, doneForm);
        }
    }
  }

  filterRelationships(formGroup: FormGroup): Observable<string[]> {
    return formGroup.get('relationship').valueChanges.pipe(
      startWith(''),
      map((filterValue) => {
        return filterValue
          ? environment.inputs.relationship.types.filter(
              (relationship) => relationship.toLowerCase().indexOf(filterValue.toLowerCase()) === 0,
            )
          : environment.inputs.relationship.types.slice();
      }),
    );
  }

  copyMainHolderAddress(mainHolderForm: FormGroup, jointMemberForm: FormGroup): void {
    const addressInputs = ['address', 'country', 'city', 'province', 'postalCode'];
    if (jointMemberForm.get('sameAddressCheckBox').value) {
      addressInputs.forEach((input) => {
        jointMemberForm.get(input).disable({ onlySelf: true });
        jointMemberForm.get(input).setValue(mainHolderForm.get(input).value);
      });
    } else {
      addressInputs.forEach((input) => {
        jointMemberForm.get(input).enable({ onlySelf: true });
      });
    }
  }

  validateRecaptcha(formGroup: FormGroup, reCaptcha: RecaptchaComponent, reCaptchaResponse: string): void {
    if (reCaptchaResponse) {
      this.subscriptions.push(
        this.sendToken(reCaptchaResponse).subscribe(
          (res: RecaptchaValidation) => {
            if (res.success) {
              formGroup.get('reCaptchaValidation').setValue(true);
            }
          },
          (error: Error) => {
            reCaptcha.reset();
            this.showReCaptchaValidationError(error.name);
          },
        ),
      );
    } else {
      formGroup.get('reCaptchaValidation').setValue(null); // When recaptcha token expire.
    }
  }

  showReCaptchaValidationError(errorName: string): void {
    let errorMessage: string;
    errorName === 'ClientOrNetworkError'
      ? (errorMessage = 'A client-side or network error occurred!')
      : (errorMessage = 'A server error occured! Please try again later.');
    this.snackBar.open(errorMessage, undefined, {
      duration: environment.registration.snackbarDuration,
      panelClass: 'snackbar',
    });
  }

  setRecaptchaValidators(formGroup: FormGroup, stepper: MatHorizontalStepper): void {
    const recaptchaInputs = ['reCaptchaValidation', 'reCaptcha'];
    if (stepper.selectedIndex === environment.registration.stepsIndex.step2) {
      recaptchaInputs.forEach((recaptchaInput) => {
        formGroup.get(recaptchaInput).setValidators([Validators.required]);
        formGroup.get(recaptchaInput).updateValueAndValidity();
      });
    } else {
      recaptchaInputs.forEach((recaptchaInput) => {
        formGroup.get(recaptchaInput).clearValidators();
        formGroup.get(recaptchaInput).updateValueAndValidity();
      });
    }
  }

  updateJointMemberStatus(status: boolean): void {
    this.jointMemberStatusSource.next(status);
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

  protected openAlertDialog(mainHolderForm: FormGroup, doneForm?: FormGroup): void {
    if (this.alertDialog.openDialogs.length > 0) {
      return; // To avoid selectionChange bug (triggered twice when value === undefined).
    }
    const alertDialogRef = this.alertDialog.open(AlertDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    this.subscriptions.push(
      alertDialogRef.afterClosed().subscribe((result: 'OK' | 'Cancel') => {
        if (result === 'OK') {
          this.jointMemberStatusSource.next(false);
          if (doneForm) {
            doneForm.reset();
            mainHolderForm.get('accountType').value === 'Individual'
              ? this.userAgreementTextSource.next(environment.inputs.userAgreementStepDone.checkBoxText.individual)
              : this.userAgreementTextSource.next('');
          }
        } else {
          mainHolderForm.get('accountType').setValue('Joint');
        }
      }),
    );
  }
}
