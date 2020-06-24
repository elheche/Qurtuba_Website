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
  emailErrors: string[];
  passwordErrors: string[];
  confirmPasswordErrors: string[];

  constructor() {

    this.loginFormGroup = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl('', [
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          // check whether the entered password has a lower-case letter
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
          // check whether the entered password has a minimum length of 8 characters
          Validators.minLength(8)
        ]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );

    this.profilFormGroup = new FormGroup({
      secondCtrl: new FormControl('', [Validators.required])
    });

    this.hide = true;
    this.isEditable = true;

    this.emailErrors = Object.keys(this.loginFormGroup.get('email').errors);
    this.passwordErrors = Object.keys(this.loginFormGroup.get('password').errors);
    this.confirmPasswordErrors = Object.keys(this.loginFormGroup.get('confirmPassword').errors);
  }

  getErrorMessage(input: 'email' | 'password' | 'confirmPassword'): string {
    switch (input) {
      case 'email':
        if (this.loginFormGroup.controls.email.hasError('required')) {
          return 'You must enter an email address.';
        }
        return this.loginFormGroup.controls.email.hasError('email') ? 'Not a valid email.' : '';
      case 'password':
        console.log(this.loginFormGroup.controls.password.errors);
        if (this.loginFormGroup.controls.password.hasError('required')) {
          return 'You must enter a password.';
        }
        return this.loginFormGroup.controls.password.hasError('hasNumber') ? 'Your password should contain a number.' : '';
      default:
        return '';
    }
  }

  getErrors(input: 'email' | 'password' | 'confirmPassword'): string[] {
    if (input === 'confirmPassword') {
      console.log(this.loginFormGroup.errors);
      return this.loginFormGroup.get(input).errors ? Object.keys(this.loginFormGroup.get(input).errors) : []
        .concat(this.loginFormGroup.errors ? Object.keys(this.loginFormGroup.errors) : []);
    }
    return this.loginFormGroup.get(input).errors ? Object.keys(this.loginFormGroup.get(input).errors) : [];
  }
}
