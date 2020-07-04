import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

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

  static dateRangeValidator(minDate: string, maxDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const inputDate = new Date(control.value).getTime();
      const minDateToNumber = new Date(minDate).getTime();
      const maxDateToNumber = new Date(maxDate).getTime();
      if (inputDate < minDateToNumber) {
        return { belowMinimumDateLimit: true };
      } else if (inputDate > maxDateToNumber) {
        return { aboveMaximumDateLimit: true };
      } else {
        return null;
      }
    };
  }
}
