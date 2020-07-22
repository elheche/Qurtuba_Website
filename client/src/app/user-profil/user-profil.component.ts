import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent extends RegistrationComponent
  implements OnInit {
  ngOnInit(): void {
    this.filteredRelationshipTypes = this.registrationFormStep4
      .get('relationship')
      .valueChanges.pipe(
        startWith(''),
        map((relationshipType) => {
          return relationshipType
            ? this._filterRelationshipTypes(relationshipType)
            : environment.inputs.relationship.types.slice();
        })
      );
    this.registrationFormStep1
      .get('email')
      .setValue('lamraoui.hichem@yahoo.ca');
    this.registrationFormStep1.get('password').setValue('Elheche2020@');
  }

  onEdit(input: string): void {
    this.environment.inputs[input].readonly = !this.environment.inputs[input]
      .readonly;
  }
}
