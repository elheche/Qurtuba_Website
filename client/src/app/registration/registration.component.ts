import { Component, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsYouType, E164Number } from 'libphonenumber-js';
import { CustomValidators } from './custom-validators';
import { Inputs } from './inputs.enum';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationFormStep1: FormGroup;
  registrationFormStep2: FormGroup;
  registrationFormStep3: FormGroup;
  registrationFormStep4: FormGroup;
  registrationFormStep5: FormGroup;
  hide: boolean;
  isEditable: boolean;
  membershipTypes: string[];
  accountTypes: string[];
  memberAccountType: string;
  inputs: typeof Inputs;
  birthDateRange: { minDate: string, maxDate: string };

  constructor() {
    this.hide = true;
    this.isEditable = true; this.membershipTypes = ['Buy a house', 'Investment'];
    this.accountTypes = ['Individual', 'Joint'];
    this.memberAccountType = '';
    this.inputs = Inputs;
    const ageOfMajority = 18;
    const lastDateOfMajority = new Date();
    lastDateOfMajority.setFullYear(new Date().getFullYear() - ageOfMajority);
    this.birthDateRange = {
      minDate: '1900-01-01',
      maxDate: lastDateOfMajority.toISOString().slice(0, 10)
    };
    const passwordMinLength = 8;
    const birthDayLength = 10;
    const phoneNumberLength = 14;

    this.registrationFormStep1 = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(passwordMinLength),
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        CustomValidators.passwordMatchValidator('password')
      ])
    });

    this.registrationFormStep2 = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthDay: new FormControl('', [
        Validators.required,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(phoneNumberLength),
        Validators.maxLength(phoneNumberLength),
        Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
      ]),
      address: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
    });

    this.registrationFormStep3 = new FormGroup({
      socialInsuranceNumber: new FormControl('', [Validators.required]),
      citizenship: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      employer: new FormControl('', [Validators.required]),
      employerPhoneNumber: new FormControl('', [Validators.required]),
      numberOfDependents: new FormControl('', [Validators.required]),
      depositAmount: new FormControl('', [Validators.required]),
      membershipFee: new FormControl('', [Validators.required]),
      donationForMosque: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', [Validators.required]),
    });

    this.registrationFormStep4 = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      socialInsuranceNumber: new FormControl('', [Validators.required]),
      citizenship: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
    });
  }

  // tslint:disable-next-line: cyclomatic-complexity
  getErrorMessage(input: Inputs): string {
    switch (input) {
      case 'EMAIL':
        if (this.registrationFormStep1.get('email').hasError('required')) {
          return 'You must enter an email address.';
        }
        return this.registrationFormStep1.get('email').hasError('email') ? 'Invalid email.' : '';
      case 'PASSWORD':
        if (this.registrationFormStep1.get('password').hasError('required')) {
          return 'You must enter a password.';
        }
        if (
          this.registrationFormStep1.get('password').hasError('minlength') ||
          this.registrationFormStep1.get('password').hasError('hasNumber') ||
          this.registrationFormStep1.get('password').hasError('hasCapitalCase') ||
          this.registrationFormStep1.get('password').hasError('hasSmallCase') ||
          this.registrationFormStep1.get('password').hasError('hasSpecialCharacters')
        ) {
          return 'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.';
        }
        return '';
      case 'CONFIRM_PASSWORD':
        if (this.registrationFormStep1.get('confirmPassword').hasError('required')) {
          return 'You must confirm your password.';
        }
        return this.registrationFormStep1.get('confirmPassword')
          .hasError('noPassswordMatch') ? 'Error: your password and confirm password do not match.' : '';
      case 'FIRST_NAME':
        return 'You must enter your first name.';
      case 'LAST_NAME':
        return 'You must enter your last name.';
      case 'BIRTH_DAY':
        console.log(this.registrationFormStep2.get('birthDay').errors);
        console.log(this.registrationFormStep2.get('birthDay').value);
        console.log(this.birthDateRange);
        if (this.registrationFormStep2.get('birthDay').hasError('required')) {
          return 'You must enter your birth day.';
        }
        return this.registrationFormStep2.get('birthDay').hasError('maxlength') ? 'Invalid date.' : '';
      default:
        return '';
    }
  }

  onPasswordValueChange(): void {
    this.registrationFormStep1.get('confirmPassword').reset();
  }

  formatPhoneNumber(keyboardEvent: KeyboardEvent): boolean {
    if (/[\d]/.test(keyboardEvent.key)) {
      const phoneNumber = new AsYouType('CA');
      phoneNumber.input(this.registrationFormStep2.get('phoneNumber').value);
      if (phoneNumber.getNumber()) {
        this.registrationFormStep2.get('phoneNumber').setValue(phoneNumber.getNumber().formatNational());
      }
      return true;
    } else {
      return false;
    }
  }
}
