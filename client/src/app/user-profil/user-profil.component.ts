import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationService } from 'src/services/registration.service';
import { environment } from '../../environments/environment';
import { RegistrationComponent } from '../registration/registration.component';

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
export class UserProfilComponent extends RegistrationComponent implements OnInit {
  readonly: boolean;
  activeTabIndex: number;
  tabsDisabled: boolean[];
  formValuesChanged: boolean[];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    registrationService: RegistrationService,
    alertDialog: MatDialog,
    snackBar: MatSnackBar,
  ) {
    super(iconRegistry, sanitizer, registrationService, alertDialog, snackBar);
    this.readonly = true;
    this.activeTabIndex = 0;
    this.tabsDisabled = [false, false, false];
    this.formValuesChanged = [false, false, false, false];
  }

  ngOnInit(): void {
    super.ngOnInit();

    Object.keys(inputs1).forEach((input: string) => {
      this.registrationFormStep1.get(input).setValue(inputs1[input]);
    });
    Object.keys(inputs2).forEach((input: string) => {
      this.registrationFormStep2.get(input).setValue(inputs2[input]);
    });
    Object.keys(inputs3).forEach((input: string) => {
      this.registrationFormStep3.get(input).setValue(inputs3[input]);
    });
    Object.keys(inputs4).forEach((input: string) => {
      this.registrationFormStep4.get(input).setValue(inputs4[input]);
    });

    this.enableProvinceAndPostalCodeInput('registrationFormStep2');
    this.enableProvinceAndPostalCodeInput('registrationFormStep4');

    this.registrationFormStep3.get('totalAmount').setValue(+inputs3.depositAmount + +inputs3.donationForMosque + +inputs3.membershipFee);

    if (inputs2.accountType === 'Joint') {
      this.isActive = true;
    }
  }

  onEdit(): void {
    switch (this.activeTabIndex) {
      case 0:
        if (!this.checkFormsValidity(['registrationFormStep1'])) {
          return;
        }
        this.toggleReadOnlyFormAttribute(['registrationFormStep1']);
        this.onSave(['registrationFormStep1']);
        break;
      case 1:
        if (!this.checkFormsValidity(['registrationFormStep2', 'registrationFormStep3'])) {
          return;
        }
        this.toggleReadOnlyFormAttribute(['registrationFormStep2', 'registrationFormStep3']);
        this.onSave(['registrationFormStep2', 'registrationFormStep3']);
        this.resetCountryInputScroll();
        break;
      case 2:
        if (!this.checkFormsValidity(['registrationFormStep4'])) {
          return;
        }
        this.toggleReadOnlyFormAttribute(['registrationFormStep4']);
        this.onSave(['registrationFormStep4']);
        this.resetCountryInputScroll();
        break;
      default:
        return;
    }
  }

  onTabChange(tabChangeEvent: MatTabChangeEvent): void {
    this.activeTabIndex = tabChangeEvent.index;
  }

  onFormChange(formGroup: string): void {
    this.formValuesChanged[environment.userProfil.forms[formGroup]] = true;
  }

  private checkFormsValidity(forms: string[]): boolean {
    let formsValidity = true;
    for (const form of forms) {
      if (this[form].invalid) {
        formsValidity = false;
        break;
      }
    }
    if (!this.readonly && !formsValidity) {
      forms.forEach((form: string) => {
        formsValidity = this[form].markAllAsTouched();
      });
      this.snackBar.open('Error: Some fields are invalid!', undefined, {
        duration: environment.userProfil.snackbarDuration,
        panelClass: 'snackbar',
      });
      return false;
    } else {
      return true;
    }
  }

  private toggleReadOnlyFormAttribute(forms: string[]): void {
    this.readonly = !this.readonly;
    switch (this.activeTabIndex) {
      case 0:
        this.tabsDisabled[environment.userProfil.tabs.personalTab] = !this.tabsDisabled[environment.userProfil.tabs.personalTab];
        this.tabsDisabled[environment.userProfil.tabs.jointMemberTab] = !this.tabsDisabled[environment.userProfil.tabs.jointMemberTab];
        break;
      case 1:
        this.tabsDisabled[environment.userProfil.tabs.loginTab] = !this.tabsDisabled[environment.userProfil.tabs.loginTab];
        this.tabsDisabled[environment.userProfil.tabs.jointMemberTab] = !this.tabsDisabled[environment.userProfil.tabs.jointMemberTab];
        break;
      case 2:
        this.tabsDisabled[environment.userProfil.tabs.loginTab] = !this.tabsDisabled[environment.userProfil.tabs.loginTab];
        this.tabsDisabled[environment.userProfil.tabs.personalTab] = !this.tabsDisabled[environment.userProfil.tabs.personalTab];
        break;
      default:
        return;
    }
    forms.forEach((form: string) => {
      Object.keys(this[form].controls).forEach((input: string) => {
        this.environment.inputs[input].readonly = !this.environment.inputs[input].readonly;
      });
    });
  }

  private onSave(forms: string[]): void {
    let formsAreChanged = false;
    for (const form of forms) {
      if (this.formValuesChanged[environment.userProfil.forms[form]]) {
        formsAreChanged = true;
        break;
      }
    }

    if (this.readonly && formsAreChanged) {
      this.snackBar.open('Success: Changes have been saved.', undefined, {
        duration: environment.userProfil.snackbarDuration,
        panelClass: 'snackbar',
      });
      for (const form of forms) {
        this.formValuesChanged[environment.userProfil.forms[form]] = false;
      }
    }
  }

  private enableProvinceAndPostalCodeInput(formGroup: string): void {
    if (this[formGroup].get('country').value) {
      this[formGroup].get('province').enable({ onlySelf: true });
      this[formGroup].get('province').updateValueAndValidity({ onlySelf: true });
      this[formGroup].get('postalCode').enable({ onlySelf: true });
      this[formGroup]
        .get('postalCode')
        .setValidators([
          Validators.required,
          Validators.pattern(new RegExp(this.data[this.findSelectedCountryIndex(formGroup, 'country')].postalCodeRegEx)),
        ]);
      this[formGroup].get('postalCode').updateValueAndValidity({ onlySelf: true });
    }
  }

  private resetCountryInputScroll(): void {
    if (!this.readonly) {
      return;
    }
    switch (this.activeTabIndex) {
      case 0:
        break;
      case 1:
        this.offsets.set('country', 0);
        this.offsets.set('citizenship', 0);
        this.getNextBatch('country');
        this.getNextBatch('citizenship');
        break;
      case 2:
        this.offsets.set('jointMemberCountry', 0);
        this.offsets.set('jointMemberCitizenship', 0);
        this.getNextBatch('jointMemberCountry');
        this.getNextBatch('jointMemberCitizenship');
        break;
      default:
        return;
    }
  }
}
