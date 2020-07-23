import { Component, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegistrationComponent } from '../registration/registration.component';

const inputs1 = {
  email: 'hichem.lamraoui@yahoo.ca',
  password: 'Elheche2020@',
  confirmPassword: '',
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
  province: 'Quebec',
  postalCode: 'H1Z 3K6',
};
const inputs3 = {
  socialInsuranceNumber: '111-222-333',
  citizenship: 'Algeria',
  profession: 'Student',
  employer: 'Polytechnique Montreal',
  employerPhoneNumber: '(514) 444-5555',
  numberOfDependents: '0',
  depositAmount: '45000',
  donationForMosque: '100',
};
const inputs4 = {
  firstName: 'Amina',
  lastName: 'Kadri',
  address: '8689, 13E Avenue',
  city: 'Montreal',
  country: 'Canada',
  province: 'Quebec',
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
  ngOnInit(): void {
    this.filteredRelationshipTypes = this.registrationFormStep4.get('relationship').valueChanges.pipe(
      startWith(''),
      map((relationshipType) => {
        return relationshipType ? this._filterRelationshipTypes(relationshipType) : environment.inputs.relationship.types.slice();
      }),
    );

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

    this.registrationFormStep2.get('province').enable({ onlySelf: true });
    this.registrationFormStep2.get('postalCode').enable({ onlySelf: true });
    this.registrationFormStep4.get('province').enable({ onlySelf: true });
    this.registrationFormStep4.get('postalCode').enable({ onlySelf: true });
  }

  onEdit(input: string): void {
    this.environment.inputs[input].readonly = !this.environment.inputs[input].readonly;
  }
}
