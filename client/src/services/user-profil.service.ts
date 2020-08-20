import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserProfilService {
  readonlySource: BehaviorSubject<boolean>;
  readonly: Observable<boolean>;

  constructor(private snackBar: MatSnackBar) {
    this.readonlySource = new BehaviorSubject<boolean>(true);
    this.readonly = this.readonlySource.asObservable();
  }

  onEdit(): void {
    this.readonlySource.next(false);
  }

  onSave(forms: FormGroup[]): void {
    let isValid = true;
    for (let i = 0; i < forms.length; i++) {
      if (i === 2 && forms[1].get('accountType').value === 'Individual') {
        continue; // To avoid checking jointMemberForm validity when accountType === Individual.
      }
      if (forms[i].invalid) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      this.readonlySource.next(true);
      this.showSnackBar('Success: Changes have been saved.');
    } else {
      this.showSnackBar('Error: Some fields are invalid!');
      forms.forEach((form) => {
        form.markAllAsTouched();
      });
    }
  }

  protected showSnackBar(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: environment.userProfil.snackbarDuration,
      panelClass: 'snackbar',
    });
  }
}
