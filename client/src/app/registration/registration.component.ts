import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Observable, Subscription } from 'rxjs';
import { RegistrationService } from 'src/services/registration.service';
import { RecaptchaValidation } from '../../../../common/communication/recaptcha-validation';
import data from '../../assets/countries-data.json';
import { environment } from '../../environments/environment';
import { CustomValidators } from './custom-validators';
import { ICountry } from './icountry';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('registrationFormStep1Ref') registrationFormStep1Ref: FormGroupDirective;
  @ViewChild('registrationFormStep2Ref') registrationFormStep2Ref: FormGroupDirective;
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('reCaptcha') reCaptcha: RecaptchaComponent;
  registrationFormStep1: FormGroup;
  registrationFormStep2: FormGroup;
  registrationFormStep3: FormGroup;
  registrationFormStep4: FormGroup;
  registrationFormStep5: FormGroup;
  hide: boolean;
  isEditable: boolean;
  jointMemberStatus: boolean;
  environment: typeof environment;
  countries: ICountry[];
  filteredRelationships: Observable<string[]>;
  userAgreementText: string;
  private subscriptions: Subscription[];

  constructor(public registrationService: RegistrationService, protected snackBar: MatSnackBar) {
    this.hide = true;
    this.isEditable = true;
    this.environment = environment;
    this.countries = data as ICountry[];
    this.subscriptions = [];

    this.registrationFormStep1 = new FormGroup({
      userAgreementStep1: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep2 = new FormGroup({
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
      reCaptcha: new FormControl(null, [Validators.required]),
      reCaptchaValidation: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep3 = new FormGroup({
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
      city: new FormControl({ value: null, disabled: true }, [Validators.required]),
      province: new FormControl({ value: null, disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: null, disabled: true }, [Validators.required]),
      phoneNumber: new FormControl({ value: null, disabled: true }, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      employer: new FormControl(null),
      employerPhoneNumber: new FormControl({ value: null, disabled: true }),
    });

    this.registrationFormStep4 = new FormGroup({
      sameAddressCheckBox: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl({ value: null, disabled: true }, [Validators.required]),
      province: new FormControl({ value: null, disabled: true }, [Validators.required]),
      postalCode: new FormControl({ value: null, disabled: true }, [Validators.required]),
      socialInsuranceNumber: new FormControl(null, [Validators.required, CustomValidators.socialInsuranceNumberValidator()]),
      profession: new FormControl(null),
      relationship: new FormControl(null, [Validators.required]),
    });

    this.registrationFormStep5 = new FormGroup({
      userAgreementStepDone: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.registrationService.jointMemberStatus.subscribe((jointMemberStatus) => {
        this.jointMemberStatus = jointMemberStatus;
      }),
    );

    this.subscriptions.push(
      this.registrationService.userAgreementText.subscribe((userAgreementText) => {
        this.userAgreementText = userAgreementText;
      }),
    );

    this.filteredRelationships = this.registrationService.filterRelationships(this.registrationFormStep4);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    for (const eventTarget of event.composedPath()) {
      const eventTargetTagName = (eventTarget as HTMLElement).tagName;
      if (eventTargetTagName === 'MAT-STEP-HEADER') {
        const eventTargetContent = (eventTarget as HTMLElement).lastElementChild.textContent;
        if (this.stepper.selectedIndex === environment.registration.stepsIndex.step1 && eventTargetContent !== 'Step 1') {
          this.registrationFormStep1Ref.onSubmit(undefined);
        }
        if (this.stepper.selectedIndex === environment.registration.stepsIndex.step2 && eventTargetContent !== 'Step 2') {
          this.registrationFormStep2Ref.onSubmit(undefined);
        }
        break;
      }
    }
  }

  validateRecaptcha(reCaptchaResponse: string): void {
    if (reCaptchaResponse) {
      this.subscriptions.push(
        this.registrationService.sendToken(reCaptchaResponse).subscribe(
          (res: RecaptchaValidation) => {
            if (res.success) {
              this.registrationFormStep2.get('reCaptchaValidation').setValue(true);
            }
          },
          (error: Error) => {
            this.reCaptcha.reset();
            this.showReCaptchaValidationError(error.name);
          },
        ),
      );
    } else {
      this.registrationFormStep2.get('reCaptchaValidation').setValue(null); // When recaptcha token expire.
    }
  }

  showReCaptchaValidationError(errorName: string): void {
    let errorMessage: string;
    errorName === 'ClientOrNetworkError'
      ? (errorMessage = 'A client-side or network error occurred!')
      : (errorMessage = 'A server error occured! Please try again later.');
    this.snackBar.open(errorMessage, undefined, {
      duration: environment.registration.snackbarDuration,
      panelClass: 'snackbar',
    });
  }

  setRecaptchaValidators(): void {
    const recaptchaInputs = ['reCaptchaValidation', 'reCaptcha'];
    if (this.stepper.selectedIndex === environment.registration.stepsIndex.step2) {
      recaptchaInputs.forEach((recaptchaInput) => {
        this.registrationFormStep2.get(recaptchaInput).setValidators([Validators.required]);
        this.registrationFormStep2.get(recaptchaInput).updateValueAndValidity();
      });
    } else {
      recaptchaInputs.forEach((recaptchaInput) => {
        this.registrationFormStep2.get(recaptchaInput).clearValidators();
        this.registrationFormStep2.get(recaptchaInput).updateValueAndValidity();
      });
    }
  }
}
