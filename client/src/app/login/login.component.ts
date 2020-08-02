import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginFrom: FormGroup;
  hide: boolean;

  constructor(private router: Router) {
    this.loginFrom = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.hide = true;
  }

  getErrorMessage(input: 'email' | 'password'): string {
    switch (input) {
      case 'email':
        if (this.loginFrom.controls.email.hasError('required')) {
          return 'You must enter your email address.';
        }
        return this.loginFrom.controls.email.hasError('email') ? 'Not a valid email.' : '';
      case 'password':
        return this.loginFrom.controls.password.hasError('required') ? 'You must enter your password.' : '';
      default:
        return '';
    }
  }

  onSubmit(loginFormValue: { email: string; password: string }, loginFormDirective: FormGroupDirective): void {
    loginFormDirective.resetForm();
    this.loginFrom.reset();
    this.router.navigateByUrl('/userProfil');
    console.log(loginFormValue);
  }
}
