import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsYouType } from 'libphonenumber-js';
import { environment } from '../../environments/environment';
import { CustomValidators } from './custom-validators';

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
  environment: typeof environment;

  constructor() {
    this.hide = true;
    this.isEditable = true;
    this.environment = environment;

    this.registrationFormStep1 = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/)
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
        CustomValidators.dateRangeValidator(
          environment.registration.birthDateRange.minDate,
          environment.registration.birthDateRange.maxDate
        )
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
      ]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
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
      city: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      socialInsuranceNumber: new FormControl('', [Validators.required]),
      citizenship: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
    });
  }

  getErrorMessage(formGroup: string, input: string): string {
    return environment.registration.errorMessages[input][Object.keys(this[formGroup].get(input).errors)[0]];
  }

  onPasswordValueChange(): void {
    this.registrationFormStep1.get('confirmPassword').reset();
  }

  formatPhoneNumber(inputEvent: InputEvent): void {
    let inputValue = this.registrationFormStep2.get('phoneNumber').value as string;
    if (/[/^¨`]/.test(inputEvent.data)) {
      return;
    }
    if (!/[\d]/.test(inputValue[inputValue.length - 1])) {
      inputValue = inputValue.slice(0, inputValue.length - 1);
      this.registrationFormStep2.get('phoneNumber').setValue(inputValue);
      return;
    }
    const phoneNumber = new AsYouType('CA');
    phoneNumber.input(inputValue);
    if (phoneNumber.getNumber()) {
      this.registrationFormStep2.get('phoneNumber').setValue(phoneNumber.getNumber().formatNational());
    }
  }
}
