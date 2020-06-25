import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  loginFormGroup: FormGroup;
  profilFormGroup: FormGroup;
  hide: boolean;
  isEditable: boolean;

  constructor() {
    this.hide = true;
    this.isEditable = true;

    const passwordMinLength = 8;

    this.loginFormGroup = new FormGroup({
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

    this.profilFormGroup = new FormGroup({
      secondCtrl: new FormControl('', [Validators.required])
    });
  }

  getErrorMessage(input: 'email' | 'password' | 'confirmPassword'): string {
    switch (input) {
      case 'email':
        if (this.loginFormGroup.get('email').hasError('required')) {
          return 'You must enter an email address.';
        }
        return this.loginFormGroup.get('email').hasError('email') ? 'Invalid email.' : '';
      case 'password':
        if (this.loginFormGroup.get('password').hasError('required')) {
          return 'You must enter a password.';
        }
        if (
          this.loginFormGroup.get('password').hasError('minlength') ||
          this.loginFormGroup.get('password').hasError('hasNumber') ||
          this.loginFormGroup.get('password').hasError('hasCapitalCase') ||
          this.loginFormGroup.get('password').hasError('hasSmallCase') ||
          this.loginFormGroup.get('password').hasError('hasSpecialCharacters')
        ) {
          return 'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.';
        }
        return '';
      case 'confirmPassword':
        if (this.loginFormGroup.get('confirmPassword').hasError('required')) {
          return 'You must confirm your password.';
        }
        return this.loginFormGroup.get('confirmPassword')
          .hasError('noPassswordMatch') ? 'Error: your password and confirm password do not match.' : '';
      default:
        return '';
    }
  }

  onValueChange(): void {
    this.loginFormGroup.get('confirmPassword').reset();
  }
}
