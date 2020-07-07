import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as fs from 'fs';
import { AsYouType } from 'libphonenumber-js';
import data from '../../assets/countries-regions-data.json';
import { environment } from '../../environments/environment';
import { CustomValidators } from './custom-validators';
import { ICountry } from './icountry.data';

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
  countries: ICountry[];

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private http: HttpClient) {
    this.hide = true;
    this.isEditable = true;
    this.environment = environment;
    this.countries = data as ICountry[];
    this.countries.forEach((country) => {
      const iconName = `flag-${country.countryShortCode.toLowerCase()}`;
      const iconUrl = `../../assets/countries-flags/${country.countryShortCode.toLowerCase()}.svg`;
      this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl(iconUrl));
    });

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
      membershipType: new FormControl('', [Validators.required]),
      accountType: new FormControl('', [Validators.required]),
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
      country: new FormControl('', [Validators.required]),
      province: new FormControl({ value: '', disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
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

  formatPostalCode(inputEvent: InputEvent): void {
    if (!inputEvent.data) {
      return;
    }
    if (/[/^¨`]/.test(inputEvent.data)) {
      return;
    }
    const postalCode = this.registrationFormStep2.get('postalCode').value as string;
    const postalCodeBlockLength = 3;
    const firstBlockIndex = 0;
    const secondBlockIndex = 4;
    if (postalCode.length >= postalCodeBlockLength) {
      this.registrationFormStep2.get('postalCode')
        .setValue(`${postalCode.substr(firstBlockIndex, postalCodeBlockLength)} ${postalCode.substr(secondBlockIndex, postalCodeBlockLength)}`);
    }
  }

  findSelectedCountryIndex(): number {
    return this.countries.findIndex((country) => country.countryName === this.registrationFormStep2.get('country').value);
  }

  onCountryValueChange(): void {
    this.getPostalCodeRegEx();
    if (this.registrationFormStep2.get('country').value) {
      this.registrationFormStep2.get('province').enable({ onlySelf: true });
      this.registrationFormStep2.get('postalCode').enable({ onlySelf: true });
      if (this.registrationFormStep2.get('country').value === 'Canada') {
        this.registrationFormStep2.get('postalCode').setValidators([
          Validators.required,
          Validators.pattern(/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/)
        ]);
        this.registrationFormStep2.get('postalCode').updateValueAndValidity({ onlySelf: true });
      } else {
        this.registrationFormStep2.get('postalCode').setValidators([Validators.required]);
        this.registrationFormStep2.get('postalCode').updateValueAndValidity({ onlySelf: true });
      }
    } else {
      this.registrationFormStep2.get('province').reset();
      this.registrationFormStep2.get('province').disable({ onlySelf: true });
      this.registrationFormStep2.get('postalCode').reset();
      this.registrationFormStep2.get('postalCode').disable({ onlySelf: true });
    }
  }

  getPostalCodeRegEx(): void {
    const countries: {
      countryName: string,
      countryShortCode: string,
      postalCodeRegEx: string
      regions: { name: string, shortCode: string }[]
    }[] = [];
    const url = 'http://i18napis.appspot.com/address/data/';

    this.countries.forEach((country) => {
      this.http.get(url.concat(country.countryShortCode)).subscribe((dataRegEX: any) => {
        countries.push({
          countryName: country.countryName,
          countryShortCode: country.countryShortCode,
          postalCodeRegEx: dataRegEX.zip ? `/^${dataRegEX.zip}$/` : '',
          regions: country.regions
        });
        if (countries.length === 248) {
          const dataUpdated = JSON.stringify(countries);
          const file = fs;
          file.writeFile('data.json', dataUpdated, (error) => {
            if (error) console.error(error);
            console.log('Writing complete');
          });
        }
      });
    });

  }
}
