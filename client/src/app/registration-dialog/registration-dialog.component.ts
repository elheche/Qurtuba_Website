import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.scss'],
})
export class RegistrationDialogComponent {
  dialogTitle: 'Uploading...' | 'Error!' | 'Done!';
  dialogIcon: 'cloud_upload' | 'error' | 'cloud_done';
  resgistrationStatus: 'isUploading' | 'isFail' | 'isSuccess';
  uploadProgress: number;
  message: string;

  constructor(public registrationDialogRef: MatDialogRef<RegistrationDialogComponent>, private router: Router) {
    this.dialogTitle = 'Uploading...';
    this.dialogIcon = 'cloud_upload';
    this.resgistrationStatus = 'isUploading';
    this.uploadProgress = 0;
    this.message = '';
  }

  navigateToLogin(): void {
    if (this.resgistrationStatus === 'isSuccess') {
      this.router.navigateByUrl('/login');
    }
  }
}
