import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RegistrationService } from 'src/services/registration.service';
import { RecaptchaValidation } from '../../../../common/communication/recaptcha-validation';
import data from '../../assets/countries-data.json';
import { environment } from '../../environments/environment';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { CustomValidators } from './custom-validators';
import { ICountry } from './icountry';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @ViewChild('registrationFormStep1Ref') registrationFormStep1Ref: FormGroupDirective;
  @ViewChild('registrationFormStep2Ref') registrationFormStep2Ref: FormGroupDirective;
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('reCaptcha') reCaptcha: RecaptchaComponent;
  registrationFormStep1: FormGroup;
  registrationFormStep2: FormGroup;
  registrationFormStep3: FormGroup;
  registrationFormStep4: FormGroup;
  registrationFormStep5: FormGroup;
  hide: boolean;
  isEditable: boolean;
  isActive: boolean;
  environment: typeof environment;
  countries: ICountry[];
  filteredRelationships: Observable<string[]>;
  userAgreementStepDoneText: string;

  constructor(public registrationService: RegistrationService, protected alertDialog: MatDialog, protected snackBar: MatSnackBar) {
    this.hide = true;
    this.isEditable = true;
    this.isActive = false;
    this.environment = environment;
    this.countries = data as ICountry[];
    this.userAgreementStepDoneText = '';

    this.registrationFormStep1 = new FormGroup({
      userAgreementStep1: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep2 = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        ),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/),
      ]),
      confirmPassword: new FormControl(null, [Validators.required, CustomValidators.passwordMatchValidator('password')]),
      reCaptcha: new FormControl(null, [Validators.required]),
      reCaptchaValidation: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep3 = new FormGroup({
      membershipType: new FormControl(null, [Validators.required]),
      accountType: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      birthDay: new FormControl(null, [
        Validators.required,
        CustomValidators.dateRangeValidator(environment.inputs.birthDay.acceptedRange.minDate),
      ]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl({ value: null, disabled: true }, [Validators.required]),
      province: new FormControl({ value: null, disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: null, disabled: true }, [Validators.required]),
      phoneNumber: new FormControl({ value: null, disabled: true }, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      employer: new FormControl(null),
      employerPhoneNumber: new FormControl({ value: null, disabled: true }),
    });

    this.registrationFormStep4 = new FormGroup({
      sameAddressCheckBox: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl({ value: null, disabled: true }, [Validators.required]),
      province: new FormControl({ value: null, disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: null, disabled: true }, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      relationship: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep5 = new FormGroup({
      userAgreementStepDone: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.filteredRelationships = this.registrationFormStep4.get('relationship').valueChanges.pipe(
      startWith(''),
      map((relationshipType) => {
        return relationshipType ? this.filterRelationshipTypes(relationshipType) : environment.inputs.relationship.types.slice();
      }),
    );
  }

  findSelectedCountryIndex(formGroup: string): number {
    return this.countries.findIndex((country) => country.countryName === this[formGroup].get('country').value);
  }

  onCountryValueChange(formGroup: string): void {
    let inputsTochange: string[];
    formGroup === 'registrationFormStep3'
      ? (inputsTochange = ['city', 'province', 'postalCode', 'phoneNumber', 'employerPhoneNumber'])
      : (inputsTochange = ['city', 'province', 'postalCode']);

    if (this[formGroup].get('country').value) {
      const countryIndex = this.findSelectedCountryIndex(formGroup);
      const regionCode = this.countries[countryIndex].countryShortCode;
      const postalCodeRegEx = this.countries[countryIndex].postalCodeRegEx;

      inputsTochange.forEach((input) => {
        this[formGroup].get(input).reset();
        this[formGroup].get(input).enable({ onlySelf: true });
        switch (input) {
          case 'postalCode':
            this[formGroup].get('postalCode').setValidators([Validators.required, Validators.pattern(new RegExp(postalCodeRegEx))]);
            break;
          case 'phoneNumber':
            this[formGroup].get('phoneNumber').setValidators([Validators.required, CustomValidators.phoneNumberValidator(regionCode)]);
            break;
          case 'employerPhoneNumber':
            this[formGroup].get('employerPhoneNumber').setValidators([CustomValidators.phoneNumberValidator(regionCode)]);
            break;
        }
        this[formGroup].get(input).updateValueAndValidity({ onlySelf: true });
      });
    } else {
      inputsTochange.forEach((input) => {
        this[formGroup].get(input).reset();
        this[formGroup].get(input).disable({ onlySelf: true });
      });
    }
  }

  formatSocialInsuranceNumber(event: InputEvent | FocusEvent, formGroup: string): void {
    if (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') {
      return;
    }

    const control: AbstractControl = this[formGroup].get('socialInsuranceNumber');
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

  onAccountTypeSelectionChange(): void {
    let isEmpty = true;
    if (this.isActive) {
      const registrationFormStep4Values = Object.values(this.registrationFormStep4.value);
      for (const value of registrationFormStep4Values) {
        if (value) {
          isEmpty = false;
          break;
        }
      }
    }
    const accountType = this.registrationFormStep3.get('accountType').value;
    switch (accountType) {
      case 'Individual':
        if (isEmpty) {
          this.isActive = false;
          this.registrationFormStep5.reset();
          this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.checkBoxText.individual;
        } else {
          this.openAlertDialog();
        }
        break;
      case 'Joint':
        this.registrationFormStep4.reset();
        this.registrationFormStep5.reset();
        this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.checkBoxText.joint;
        this.isActive = true;
        break;
      default:
        if (isEmpty) {
          this.isActive = false;
          this.registrationFormStep5.reset();
          this.userAgreementStepDoneText = '';
        } else {
          this.openAlertDialog();
        }
    }
  }

  protected filterRelationshipTypes(filterValue: string): string[] {
    return environment.inputs.relationship.types.filter(
      (relationshipType) => relationshipType.toLowerCase().indexOf(filterValue.toLowerCase()) === 0,
    );
  }

  protected openAlertDialog(): void {
    if (this.alertDialog.openDialogs.length > 0) {
      return; // To avoid selectionChange bug (triggered twice when value === undefined).
    }
    const alertDialogRef = this.alertDialog.open(AlertDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    alertDialogRef.afterClosed().subscribe((result: 'OK' | 'Cancel') => {
      if (result === 'OK') {
        this.isActive = false;
        this.registrationFormStep5.reset();
        this.registrationFormStep3.get('accountType').value === 'Individual'
          ? (this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.checkBoxText.individual)
          : (this.userAgreementStepDoneText = '');
      } else {
        this.registrationFormStep3.get('accountType').setValue('Joint');
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    for (const eventTarget of event.composedPath()) {
      const eventTargetTagName = (eventTarget as HTMLElement).tagName;
      if (eventTargetTagName === 'MAT-STEP-HEADER') {
        const eventTargetContent = (eventTarget as HTMLElement).lastElementChild.textContent;
        if (this.stepper.selectedIndex === environment.registration.stepsIndex.step1 && eventTargetContent !== 'Step 1') {
          this.registrationFormStep1Ref.onSubmit(undefined);
        }
        if (this.stepper.selectedIndex === environment.registration.stepsIndex.step2 && eventTargetContent !== 'Step 2') {
          this.registrationFormStep2Ref.onSubmit(undefined);
        }
        break;
      }
    }
  }

  validateRecaptcha(reCaptchaResponse: string): void {
    if (reCaptchaResponse) {
      this.registrationService.sendToken(reCaptchaResponse).subscribe(
        (res: RecaptchaValidation) => {
          if (res.success) {
            this.registrationFormStep2.get('reCaptchaValidation').setValue(true);
          }
        },
        (error: Error) => {
          this.reCaptcha.reset();
          this.showReCaptchaValidationError(error.name);
        },
      );
    } else {
      this.registrationFormStep2.get('reCaptchaValidation').setValue(null); // When recaptcha token expire.
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

  setRecaptchaValidators(): void {
    const recaptchaInputs = ['reCaptchaValidation', 'reCaptcha'];
    if (this.stepper.selectedIndex === environment.registration.stepsIndex.step2) {
      recaptchaInputs.forEach((recaptchaInput) => {
        this.registrationFormStep2.get(recaptchaInput).setValidators([Validators.required]);
        this.registrationFormStep2.get(recaptchaInput).updateValueAndValidity();
      });
    } else {
      recaptchaInputs.forEach((recaptchaInput) => {
        this.registrationFormStep2.get(recaptchaInput).clearValidators();
        this.registrationFormStep2.get(recaptchaInput).updateValueAndValidity();
      });
    }
  }

  copyMainHolderAddress(event?: MatCheckboxChange): void {
    const addressInputs = ['address', 'country', 'city', 'province', 'postalCode'];
    if (!event) {
      if (
        this.stepper.selectedIndex === environment.registration.stepsIndex.step4 &&
        this.registrationFormStep4.get('sameAddressCheckBox').value
      ) {
        addressInputs.forEach((input) => {
          this.registrationFormStep4.get(input).setValue(this.registrationFormStep3.get(input).value);
        });
      }
      return;
    }
    if (event.checked) {
      addressInputs.forEach((input) => {
        this.registrationFormStep4.get(input).disable({ onlySelf: true });
        this.registrationFormStep4.get(input).setValue(this.registrationFormStep3.get(input).value);
      });
    } else {
      addressInputs.forEach((input) => {
        this.registrationFormStep4.get(input).reset();
        this.registrationFormStep4.get(input).enable({ onlySelf: true });
      });
    }
  }
}
