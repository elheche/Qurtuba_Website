import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfilComponent } from './user-profil/user-profil.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegistrationComponent, LogoutComponent, UserProfilComponent, AlertDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectInfiniteScrollModule,
    MatDialogModule,
    MatListModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ScrollingModule,
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: environment.inputs.reCaptcha.language,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.inputs.reCaptcha.siteKey } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertDialogComponent],
})
export class AppModule {}
