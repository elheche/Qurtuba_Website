import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AsYouType } from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import data from '../../assets/countries-data.json';
import { environment } from '../../environments/environment';
import { CustomValidators } from './custom-validators';
import { ICountry } from './icountry.data';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationFormStep1: FormGroup;
  registrationFormStep2: FormGroup;
  registrationFormStep3: FormGroup;
  registrationFormStep4: FormGroup;
  registrationFormStep5: FormGroup;
  hide: boolean;
  isEditable: boolean;
  environment: typeof environment;
  countries: ICountry[];
  filteredRelationshipTypes: Observable<string[]>;
  userAgreementText: string;

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
    this.userAgreementText = '';

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
      membershipType: new FormControl('', [
        Validators.required
      ]),
      accountType: new FormControl('', [
        Validators.required
      ]),
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
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
      address: new FormControl('', [
        Validators.required
      ]),
      city: new FormControl('', [
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.required
      ]),
      province: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      postalCode: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ])
    });

    this.registrationFormStep3 = new FormGroup({
      socialInsuranceNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}[\- ]?\d{3}[\- ]?\d{3}$/)
      ]),
      citizenship: new FormControl('', [
        Validators.required
      ]),
      profession: new FormControl('', [
        Validators.required
      ]),
      employer: new FormControl('', [
        Validators.required
      ]),
      employerPhoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
      ]),
      numberOfDependents: new FormControl('', [
        Validators.required
      ]),
      depositAmount: new FormControl('', [
        Validators.required
      ]),
      donationForMosque: new FormControl('', [
        Validators.required
      ]),
      membershipFee: new FormControl(environment.registration.membershipFeeDefaultAmount),
      totalAmount: new FormControl(environment.registration.membershipFeeDefaultAmount)
    });

    this.registrationFormStep4 = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      address: new FormControl('', [
        Validators.required
      ]),
      city: new FormControl('', [
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.required
      ]),
      province: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      postalCode: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      socialInsuranceNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}[\- ]?\d{3}[\- ]?\d{3}$/)
      ]),
      citizenship: new FormControl('', [
        Validators.required
      ]),
      profession: new FormControl('', [
        Validators.required
      ]),
      relationship: new FormControl('', [
        Validators.required
      ])
    });

    this.registrationFormStep5 = new FormGroup({
      userAgreement: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {
    this.filteredRelationshipTypes = this.registrationFormStep4.get('relationship').valueChanges
      .pipe(
        startWith(''),
        map((relationshipType) => {
          return relationshipType ? this._filterRelationshipTypes(relationshipType) : environment.registration.relationshipTypes.slice();
        })
      );
  }

  getErrorMessage(formGroup: string, input: string): string {
    return environment.registration.errorMessages[input][Object.keys(this[formGroup].get(input).errors)[0]];
  }

  onPasswordValueChange(): void {
    this.registrationFormStep1.get('confirmPassword').reset();
  }

  formatPhoneNumber(inputEvent: InputEvent, formGroup: string, input: string): void {
    let inputValue = this[formGroup].get(input).value as string;
    if (/[/^¨`]/.test(inputEvent.data)) {
      return;
    }
    if (!/[\d]/.test(inputValue[inputValue.length - 1])) {
      inputValue = inputValue.slice(0, inputValue.length - 1);
      this[formGroup].get(input).setValue(inputValue);
      return;
    }
    const phoneNumber = new AsYouType('CA');
    phoneNumber.input(inputValue);
    if (phoneNumber.getNumber()) {
      this[formGroup].get(input).setValue(phoneNumber.getNumber().formatNational());
    }
  }

  formatCanadianPostalCode(inputEvent: InputEvent, formGroup: string): void {
    if (!inputEvent.data
      || /[/^¨`]/.test(inputEvent.data)
      || this[formGroup].get('country').value !== 'Canada'
    ) {
      return;
    }
    const postalCode = this[formGroup].get('postalCode').value as string;
    const postalCodeBlockLength = 3;
    const firstBlockIndex = 0;
    const secondBlockIndex = 4;
    if (postalCode.length >= postalCodeBlockLength) {
      this[formGroup].get('postalCode')
        .setValue(`${postalCode.substr(firstBlockIndex, postalCodeBlockLength)} ${postalCode.substr(secondBlockIndex, postalCodeBlockLength)}`);
    }
  }

  findSelectedCountryIndex(formGroup: string): number {
    return this.countries.findIndex((country) => country.countryName === this[formGroup].get('country').value);
  }

  onCountryValueChange(formGroup: string): void {
    if (this[formGroup].get('country').value) {
      this[formGroup].get('province').reset();
      this[formGroup].get('province').enable({ onlySelf: true });
      this[formGroup].get('postalCode').reset();
      this[formGroup].get('postalCode').enable({ onlySelf: true });
      this[formGroup].get('postalCode').setValidators([
        Validators.required,
        Validators.pattern(new RegExp(this.countries[this.findSelectedCountryIndex(formGroup)].postalCodeRegEx))
      ]);
      this[formGroup].get('postalCode').updateValueAndValidity({ onlySelf: true });
    } else {
      this[formGroup].get('province').reset();
      this[formGroup].get('province').disable({ onlySelf: true });
      this[formGroup].get('postalCode').reset();
      this[formGroup].get('postalCode').disable({ onlySelf: true });
    }
  }

  formatSocialInsuranceNumber(event: unknown, formGroup: string): void {
    let inputValue = this[formGroup].get('socialInsuranceNumber').value as string;
    const regEx1 = /^(\d{3})[\- ]?(\d{0,2})$/;
    const regEx2 = /^(\d{3})[\- ]?(\d{3})[\- ]?(\d{0,3})$/;
    const regEx3 = /^(\d{3})[\- ]?(\d{3})[\- ]?(\d{3})(.*)$/;
    if ((event instanceof InputEvent) && (!event.data || /[/^¨`]/.test(event.data))) {
      return;
    }
    if ((event instanceof InputEvent) && !/[\d]/.test(inputValue[inputValue.length - 1])) {
      inputValue = inputValue.slice(0, inputValue.length - 1);
      this[formGroup].get('socialInsuranceNumber').setValue(inputValue);
      return;
    }
    if (regEx1.test(inputValue)) {
      const inputValueFormatted = inputValue.replace(regEx1, '$1-$2');
      this[formGroup].get('socialInsuranceNumber').setValue(inputValueFormatted);
    } else if (regEx2.test(inputValue)) {
      const inputValueFormatted = inputValue.replace(regEx2, '$1-$2-$3');
      this[formGroup].get('socialInsuranceNumber').setValue(inputValueFormatted);
    } else if (regEx3.test(inputValue)) {
      const inputValueFormatted = inputValue.replace(regEx3, '$1-$2-$3');
      this[formGroup].get('socialInsuranceNumber').setValue(inputValueFormatted);
    } else {
      return;
    }
  }

  updateTotalAmount(): void {
    const depositAmount = this.registrationFormStep3.get('depositAmount').value ?
      this.registrationFormStep3.get('depositAmount').value : 0;
    const donationForMosque = this.registrationFormStep3.get('donationForMosque').value ?
      this.registrationFormStep3.get('donationForMosque').value : 0;
    const membershipFee = this.registrationFormStep3.get('membershipFee').value ?
      this.registrationFormStep3.get('membershipFee').value : 0;
    const totalAmount = depositAmount + donationForMosque + membershipFee;
    this.registrationFormStep3.get('totalAmount').setValue(totalAmount);
  }

  private _filterRelationshipTypes(filterValue: string): string[] {
    return environment.registration.relationshipTypes
      .filter((relationshipType) => relationshipType.toLowerCase().indexOf(filterValue.toLowerCase()) === 0);
  }

  onAccountTypeSelectionChange(): void {
    this.registrationFormStep2.get('accountType').value === 'Individual' ?
      this.userAgreementText = environment.registration.userAgreementText.individual :
      this.userAgreementText = environment.registration.userAgreementText.joint;
  }

  /* getPostalCodeRegEx(): void {
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
          postalCodeRegEx: dataRegEX.zip ? `^${dataRegEX.zip}$` : '',
          regions: country.regions
        });
        if (countries.length === 248) {
          const dataUpdated = JSON.stringify(countries);
          const blob = new Blob([dataUpdated], { type: 'application/json;charset=utf-8' });
          FileSaver.saveAs(blob, 'dataUpdated.json');
        }
      });
    });
  } */
}
