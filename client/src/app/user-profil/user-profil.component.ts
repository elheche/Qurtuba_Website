import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent extends RegistrationComponent implements OnInit {

  ngOnInit(): void {
    this.registrationFormStep1.get('email').setValue('lamraoui.hichem@yahoo.ca');
    this.registrationFormStep1.get('password').setValue('Elheche2020@');
  }

  onEdit(input: string): void {
    this.environment.inputs[input].readonly = !this.environment.inputs[input].readonly;
  }
}
