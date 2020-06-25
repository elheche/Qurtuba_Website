import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static patternValidator(regExp: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const valid = regExp.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(comparingPassword: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent || !control.value || !control.parent.get(comparingPassword).value) {
        return null;
      }
      const password = control.parent.get(comparingPassword).value;
      const confirmPassword = control.value;
      return password && confirmPassword && password === confirmPassword ? null : { noPassswordMatch: true };
    };
  }
}
