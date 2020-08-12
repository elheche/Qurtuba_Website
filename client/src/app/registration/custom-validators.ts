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

  static dateRangeValidator(minDate: string, maxDate?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const inputDate = new Date(control.value).getTime();
      const minDateToNumber = new Date(minDate).getTime();
      const maxDateToNumber = maxDate ? new Date(maxDate).getTime() : undefined;
      if (inputDate < minDateToNumber) {
        return { belowMinimumDateLimit: true };
      } else if (maxDateToNumber && inputDate > maxDateToNumber) {
        return { aboveMaximumDateLimit: true };
      } else {
        return null;
      }
    };
  }

  static socialInsuranceNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const socialInsuranceNumber = control.value as string;
      const socialInsuranceNumberPattern = /^\d{3}[\- ]?\d{3}[\- ]?\d{3}$/;
      const maxNumber = 9;
      const divider = 10;
      let isValid = false;
      let sum = 0;
      let offset = 0;

      for (let i = 0; i < socialInsuranceNumber.length; i++) {
        if (!/^[\d]$/.test(socialInsuranceNumber[i])) {
          offset++;
          continue;
        }
        if ((i - offset) % 2 === 0) {
          sum += parseInt(socialInsuranceNumber[i], 10);
        } else {
          const oddIndexNumber = parseInt(socialInsuranceNumber[i], 10) * 2;
          if (oddIndexNumber > maxNumber) {
            sum += parseInt(oddIndexNumber.toString()[0], 10) + parseInt(oddIndexNumber.toString()[1], 10);
          } else {
            sum += parseInt(socialInsuranceNumber[i], 10) * 2;
          }
        }
      }

      isValid = sum % divider === 0;

      if (!isValid || !socialInsuranceNumberPattern.test(socialInsuranceNumber)) {
        return { invalidSocialInsuranceNumber: true };
      } else {
        return null;
      }
    };
  }
}
