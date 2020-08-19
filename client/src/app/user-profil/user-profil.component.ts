import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistrationService } from 'src/services/registration.service';
import { UserProfilService } from 'src/services/user-profil.service';
import data from '../../assets/countries-data.json';
import { CustomValidators } from '../registration/custom-validators';
import { ICountry } from '../registration/icountry';

const loginInputs = {
  email: 'hichem.lamraoui@yahoo.ca',
  password: 'Elheche2020@',
  confirmPassword: 'Elheche2020@',
};
const mainHolderInputs = {
  membershipType: 'Buy a house',
  accountType: 'Joint',
  title: 'Mr.',
  firstName: 'Hichem',
  lastName: 'Lamraoui',
  birthDay: '1983-07-06',
  phoneNumber: '(514) 756-5574',
  address: '8689, 13E Avenue',
  city: 'Montreal',
  country: 'Canada',
  province: 'Quebec (QC)',
  postalCode: 'H1Z 3K6',
  socialInsuranceNumber: '240-000-000',
  profession: 'Student',
  employer: 'Polytechnique Montreal',
  employerPhoneNumber: '(514) 444-5555',
};

const jointMemberInputs = {
  title: 'Mrs.',
  firstName: 'Amina',
  lastName: 'Kadri',
  address: '8689, 13E Avenue',
  city: 'Montreal',
  country: 'Canada',
  province: 'Quebec (QC)',
  postalCode: 'H1Z 3K6',
  socialInsuranceNumber: '240-420-000',
  profession: 'Nurse',
  relationship: 'Wife',
};

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  readonly: boolean;
  hide: boolean;
  environment: typeof environment;
  countries: ICountry[];
  filteredRelationships: Observable<string[]>;
  jointMemberStatus: boolean;
  loginForm: FormGroup;
  mainHolderForm: FormGroup;
  jointMemberForm: FormGroup;
  private subscriptions: Subscription[];

  constructor(public registrationService: RegistrationService, public userProfilService: UserProfilService) {
    this.hide = true;
    this.environment = environment;
    this.countries = data as ICountry[];
    this.subscriptions = [];
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
      city: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      postalCode: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      employer: new FormControl(null),
      employerPhoneNumber: new FormControl(null),
    });
    this.jointMemberForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      postalCode: new FormControl(null, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      relationship: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    Object.keys(loginInputs).forEach((input: string) => {
      this.loginForm.get(input).setValue(loginInputs[input]);
    });
    Object.keys(mainHolderInputs).forEach((input: string) => {
      this.mainHolderForm.get(input).setValue(mainHolderInputs[input]);
    });
    Object.keys(jointMemberInputs).forEach((input: string) => {
      this.jointMemberForm.get(input).setValue(jointMemberInputs[input]);
    });
    this.filteredRelationships = this.registrationService.filterRelationships(this.jointMemberForm);
    this.subscriptions.push(
      this.userProfilService.readonly.subscribe((readonly) => {
        this.readonly = readonly;
      }),
    );
    if (this.mainHolderForm.get('accountType').value === 'Joint') {
      this.registrationService.updateJointMemberStatus(true);
    }
    this.subscriptions.push(
      this.registrationService.jointMemberStatus.subscribe((jointMemberStatus) => {
        this.jointMemberStatus = jointMemberStatus;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
