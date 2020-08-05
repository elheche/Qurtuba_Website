import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AsYouType } from 'libphonenumber-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
import data from '../../assets/countries-data.json';
import { environment } from '../../environments/environment';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { CustomValidators } from './custom-validators';
import { ICountry } from './icountry.data';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationFormStep0: FormGroup;
  registrationFormStep1: FormGroup;
  registrationFormStep2: FormGroup;
  registrationFormStep3: FormGroup;
  registrationFormStep4: FormGroup;
  registrationFormStep5: FormGroup;
  hide: boolean;
  isEditable: boolean;
  isActive: boolean;
  environment: typeof environment;
  data: ICountry[];
  filteredRelationshipTypes: Observable<string[]>;
  userAgreementStep0Text: string;
  userAgreementStepDoneText: string;
  limit: number;
  offsets: Map<'country' | 'citizenship' | 'jointMemberCountry' | 'jointMemberCitizenship', number>;
  countriesSources: Map<'country' | 'citizenship' | 'jointMemberCountry' | 'jointMemberCitizenship', BehaviorSubject<ICountry[]>>;
  countries: Map<'country' | 'citizenship' | 'jointMemberCountry' | 'jointMemberCitizenship', Observable<ICountry[]>>;

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, protected alertDialog: MatDialog) {
    this.hide = true;
    this.isEditable = true;
    this.isActive = false;
    this.environment = environment;
    this.data = data as ICountry[];

    this.data.forEach((country) => {
      const iconName = `flag-${country.countryShortCode.toLowerCase()}`;
      const iconUrl = `../../assets/countries-flags/${country.countryShortCode.toLowerCase()}.svg`;
      this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl(iconUrl));
    });

    this.limit = environment.registration.batchLength;

    this.offsets = new Map([
      ['country', 0],
      ['citizenship', 0],
      ['jointMemberCountry', 0],
      ['jointMemberCitizenship', 0],
    ]);

    this.countriesSources = new Map([
      ['country', new BehaviorSubject<ICountry[]>([])],
      ['citizenship', new BehaviorSubject<ICountry[]>([])],
      ['jointMemberCountry', new BehaviorSubject<ICountry[]>([])],
      ['jointMemberCitizenship', new BehaviorSubject<ICountry[]>([])],
    ]);

    this.countries = new Map();

    for (const key of this.countriesSources.keys()) {
      this.countries.set(
        key,
        this.countriesSources
          .get(key)
          .asObservable()
          .pipe(
            scan((acc, curr) => {
              return [...acc, ...curr];
            }, []),
          ),
      );
    }

    this.userAgreementStep0Text = '';
    this.userAgreementStepDoneText = '';

    this.registrationFormStep0 = new FormGroup({
      userAgreementStep0: new FormControl('', [Validators.required]),
    });

    this.registrationFormStep1 = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required, CustomValidators.passwordMatchValidator('password')]),
    });

    this.registrationFormStep2 = new FormGroup({
      membershipType: new FormControl('', [Validators.required]),
      accountType: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthDay: new FormControl('', [
        Validators.required,
        CustomValidators.dateRangeValidator(
          environment.inputs.birthDay.acceptedRange.minDate,
          environment.inputs.birthDay.acceptedRange.maxDate,
        ),
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      province: new FormControl({ value: '', disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });

    this.registrationFormStep3 = new FormGroup({
      socialInsuranceNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}[\- ]?\d{3}[\- ]?\d{3}$/)]),
      citizenship: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      employer: new FormControl('', [Validators.required]),
      employerPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
      numberOfDependents: new FormControl('', [Validators.required]),
      depositAmount: new FormControl('', [Validators.required]),
      donationForMosque: new FormControl('', [Validators.required]),
      membershipFee: new FormControl(environment.inputs.membershipFee.defaultAmount),
      totalAmount: new FormControl(environment.inputs.membershipFee.defaultAmount),
    });

    this.registrationFormStep4 = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      province: new FormControl({ value: '', disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      socialInsuranceNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}[\- ]?\d{3}[\- ]?\d{3}$/)]),
      citizenship: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
    });

    this.registrationFormStep5 = new FormGroup({
      userAgreementStepDone: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.filteredRelationshipTypes = this.registrationFormStep4.get('relationship').valueChanges.pipe(
      startWith(''),
      map((relationshipType) => {
        return relationshipType ? this.filterRelationshipTypes(relationshipType) : environment.inputs.relationship.types.slice();
      }),
    );

    for (const key of this.countries.keys()) {
      this.getNextBatch(key);
    }
  }

  getErrorMessage(formGroup: string, input: string): string {
    return environment.inputs[input].errorMessages[Object.keys(this[formGroup].get(input).errors)[0]];
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
    if (!inputEvent.data || /[/^¨`]/.test(inputEvent.data) || this[formGroup].get('country').value !== 'Canada') {
      return;
    }
    const postalCode = this[formGroup].get('postalCode').value as string;
    const postalCodeBlockLength = 3;
    const firstBlockIndex = 0;
    const secondBlockIndex = 4;
    if (postalCode.length >= postalCodeBlockLength) {
      this[formGroup]
        .get('postalCode')
        .setValue(
          `${postalCode.substr(firstBlockIndex, postalCodeBlockLength)} ${postalCode.substr(secondBlockIndex, postalCodeBlockLength)}`,
        );
    }
  }

  findSelectedCountryIndex(formGroup: string, input: 'country' | 'citizenship'): number {
    return this.data.findIndex((country) => country.countryName === this[formGroup].get(input).value);
  }

  onCountryValueChange(formGroup: string): void {
    if (this[formGroup].get('country').value) {
      this[formGroup].get('province').reset();
      this[formGroup].get('province').enable({ onlySelf: true });
      this[formGroup].get('province').updateValueAndValidity({ onlySelf: true });
      this[formGroup].get('postalCode').reset();
      this[formGroup].get('postalCode').enable({ onlySelf: true });
      this[formGroup]
        .get('postalCode')
        .setValidators([
          Validators.required,
          Validators.pattern(new RegExp(this.data[this.findSelectedCountryIndex(formGroup, 'country')].postalCodeRegEx)),
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
    if (event instanceof InputEvent && (!event.data || /[/^¨`]/.test(event.data))) {
      return;
    }
    if (event instanceof InputEvent && !/[\d]/.test(inputValue[inputValue.length - 1])) {
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
    const depositAmount = this.registrationFormStep3.get('depositAmount').value ? this.registrationFormStep3.get('depositAmount').value : 0;
    const donationForMosque = this.registrationFormStep3.get('donationForMosque').value
      ? this.registrationFormStep3.get('donationForMosque').value
      : 0;
    const membershipFee = this.registrationFormStep3.get('membershipFee').value ? this.registrationFormStep3.get('membershipFee').value : 0;
    const totalAmount = depositAmount + donationForMosque + membershipFee;
    this.registrationFormStep3.get('totalAmount').setValue(totalAmount);
  }

  onAccountTypeSelectionChange(): void {
    let isEmpty = true;
    if (this.isActive) {
      const registrationFormStep4Values = Object.values(this.registrationFormStep4.value);
      for (const value of registrationFormStep4Values) {
        if (value) {
          isEmpty = false;
          break;
        }
      }
    }
    const accountType = this.registrationFormStep2.get('accountType').value;
    switch (accountType) {
      case 'Individual':
        if (isEmpty) {
          this.isActive = false;
          this.registrationFormStep5.reset();
          this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.text.individual;
        } else {
          this.openAlertDialog();
        }
        break;
      case 'Joint':
        this.registrationFormStep4.reset();
        this.offsets.set('jointMemberCountry', 0);
        this.offsets.set('jointMemberCitizenship', 0);
        this.getNextBatch('jointMemberCountry');
        this.getNextBatch('jointMemberCitizenship');
        this.registrationFormStep5.reset();
        this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.text.joint;
        this.isActive = true;
        break;
      default:
        if (isEmpty) {
          this.isActive = false;
          this.registrationFormStep5.reset();
          this.userAgreementStepDoneText = '';
        } else {
          this.openAlertDialog();
        }
    }
  }

  getNextBatch(input: 'country' | 'citizenship' | 'jointMemberCountry' | 'jointMemberCitizenship'): void {
    const result = this.data.slice(this.offsets.get(input), this.offsets.get(input) + this.limit);
    this.countriesSources.get(input).next(result);
    const offset = this.offsets.get(input) + this.limit;
    this.offsets.set(input, offset);
  }

  protected filterRelationshipTypes(filterValue: string): string[] {
    return environment.inputs.relationship.types.filter(
      (relationshipType) => relationshipType.toLowerCase().indexOf(filterValue.toLowerCase()) === 0,
    );
  }

  protected openAlertDialog(): void {
    if (this.alertDialog.openDialogs.length > 0) {
      return; // To avoid selectionChange bug (triggered twice when value === undefined).
    }
    const alertDialogRef = this.alertDialog.open(AlertDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    alertDialogRef.afterClosed().subscribe((result: 'OK' | 'Cancel') => {
      if (result === 'OK') {
        this.isActive = false;
        this.registrationFormStep5.reset();
        this.registrationFormStep2.get('accountType').value === 'Individual'
          ? (this.userAgreementStepDoneText = environment.inputs.userAgreementStepDone.text.individual)
          : (this.userAgreementStepDoneText = '');
      } else {
        this.registrationFormStep2.get('accountType').setValue('Joint');
      }
    });
  }
}
