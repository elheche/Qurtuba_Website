import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import data from '../../assets/countries-data.json';
import { CustomValidators } from '../registration/custom-validators';
import { ICountry } from '../registration/icountry';

const inputs1 = {
  email: 'hichem.lamraoui@yahoo.ca',
  password: 'Elheche2020@',
  confirmPassword: 'Elheche2020@',
};
const inputs2 = {
  membershipType: 'Buy a house',
  accountType: 'Joint',
  firstName: 'Hichem',
  lastName: 'Lamraoui',
  birthDay: '1983-07-06',
  phoneNumber: '(514) 756-5574',
  address: '8689, 13E Avenue',
  city: 'Montreal',
  country: 'Canada',
  province: 'Quebec (QC)',
  postalCode: 'H1Z 3K6',
};
const inputs3 = {
  socialInsuranceNumber: '111-222-333',
  citizenship: 'Algeria',
  profession: 'Student',
  employer: 'Polytechnique Montreal',
  employerPhoneNumber: '(514) 444-5555',
  numberOfDependents: '0',
  depositAmount: '50000',
  donationForMosque: '100',
  membershipFee: '75',
};
const inputs4 = {
  firstName: 'Amina',
  lastName: 'Kadri',
  address: '8689, 13E Avenue',
  city: 'Montreal',
  country: 'Canada',
  province: 'Quebec (QC)',
  postalCode: 'H1Z 3K6',
  socialInsuranceNumber: '444-555-666',
  citizenship: 'Algeria',
  profession: 'Nurse',
  relationship: 'Wife',
};

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent implements OnInit {
  readonly: boolean;
  hide: boolean;
  environment: typeof environment;
  countries: ICountry[];
  filteredRelationships: Observable<string[]>;
  loginForm: FormGroup;
  mainHolderForm: FormGroup;
  jointMemberForm: FormGroup;

  constructor() {
    this.readonly = true;
    this.hide = true;
    this.environment = environment;
    this.countries = data as ICountry[];
    this.loginForm = new FormGroup({
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
    });
    this.mainHolderForm = new FormGroup({
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
    this.jointMemberForm = new FormGroup({
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
  }

  ngOnInit(): void {
    this.filteredRelationships = this.jointMemberForm.get('relationship').valueChanges.pipe(
      startWith(''),
      map((relationshipType) => {
        return relationshipType ? this.filterRelationshipTypes(relationshipType) : environment.inputs.relationship.types.slice();
      }),
    );
  }

  onEdit(): void {
    this.readonly = !this.readonly;
  }

  getErrorMessage(formGroup: string, input: string): string {
    return environment.inputs[input].errorMessages[Object.keys(this[formGroup].get(input).errors)[0]];
  }

  onPasswordValueChange(): void {
    this.mainHolderForm.get('confirmPassword').reset();
  }

  formatPhoneNumber(event: InputEvent | FocusEvent, formGroup: string, input: string): void {
    if (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') {
      return;
    }

    const control: AbstractControl = this[formGroup].get(input);
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

  formatCanadianPostalCode(event: InputEvent | FocusEvent, formGroup: string): void {
    if (
      (event.type === 'input' && (event as InputEvent).inputType === 'insertCompositionText') ||
      this[formGroup].get('country').value !== 'Canada'
    ) {
      return;
    }

    const control: AbstractControl = this[formGroup].get('postalCode');
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

  onAccountTypeSelectionChange(): void {/*  */}

  protected filterRelationshipTypes(filterValue: string): string[] {
    return environment.inputs.relationship.types.filter(
      (relationshipType) => relationshipType.toLowerCase().indexOf(filterValue.toLowerCase()) === 0,
    );
  }
}
