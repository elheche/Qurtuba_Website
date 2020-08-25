import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Observable, Subscription } from 'rxjs';
import { RegistrationService } from 'src/services/registration.service';
import User, { IUser } from '../../../../server/app/user';
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

  constructor(public registrationService: RegistrationService) {
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

  sendRegistrationForm(): void {
    if (this.registrationFormStep5.invalid) {
      return;
    }

    const registrationDialogRef = this.registrationService.openRegistrationDialog();

    const user = new User({
      login: {
        email: this.registrationFormStep2.get('email').value,
        password: this.registrationFormStep2.get('password').value,
      },
      mainHolder: {
        membershipType: this.registrationFormStep3.get('membershipType').value,
        accountType: this.registrationFormStep3.get('accountType').value,
        title: this.registrationFormStep3.get('title').value,
        firstName: this.registrationFormStep3.get('firstName').value,
        lastName: this.registrationFormStep3.get('lastName').value,
        birthDay: this.registrationFormStep3.get('birthDay').value,
        address: this.registrationFormStep3.get('address').value,
        country: this.registrationFormStep3.get('country').value,
        city: this.registrationFormStep3.get('city').value,
        province: this.registrationFormStep3.get('province').value,
        postalCode: this.registrationFormStep3.get('postalCode').value,
        phoneNumber: this.registrationFormStep3.get('phoneNumber').value,
        socialInsuranceNumber: this.registrationFormStep3.get('socialInsuranceNumber').value,
        profession: this.registrationFormStep3.get('profession').value,
        employer: this.registrationFormStep3.get('employer').value,
        employerPhoneNumber: this.registrationFormStep3.get('employerPhoneNumber').value,
      },
      jointMember:
        this.registrationFormStep3.get('accountType').value === 'Joint'
          ? {
              title: this.registrationFormStep4.get('title').value,
              firstName: this.registrationFormStep4.get('firstName').value,
              lastName: this.registrationFormStep4.get('lastName').value,
              address: this.registrationFormStep4.get('address').value,
              country: this.registrationFormStep4.get('country').value,
              city: this.registrationFormStep4.get('city').value,
              province: this.registrationFormStep4.get('province').value,
              postalCode: this.registrationFormStep4.get('postalCode').value,
              relationship: this.registrationFormStep4.get('relationship').value,
              socialInsuranceNumber: this.registrationFormStep4.get('socialInsuranceNumber').value,
              profession: this.registrationFormStep4.get('profession').value,
            }
          : undefined,
    });

    this.subscriptions.push(
      this.registrationService.AddUser(user).subscribe(
        (event: HttpEvent<IUser>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              registrationDialogRef.componentInstance.message = 'Sending the request to the server...';
              break;
            case HttpEventType.UploadProgress:
              const percentageCoefficent = 100;
              const uploadProgress = Math.round((event.loaded / (event.total as number)) * percentageCoefficent);
              registrationDialogRef.componentInstance.uploadProgress = uploadProgress;
              registrationDialogRef.componentInstance.message = `Creating your account is in progress...${uploadProgress}%`;
              break;
            case HttpEventType.ResponseHeader:
              registrationDialogRef.componentInstance.message = 'Receiving response from server...';
              break;
            case HttpEventType.Response:
              registrationDialogRef.componentInstance.message = 'Account created successfully.';
          }
        },

        (error: Error) => {
          registrationDialogRef.componentInstance.dialogTitle = 'Error!';
          registrationDialogRef.componentInstance.dialogIcon = 'error';
          registrationDialogRef.componentInstance.resgistrationStatus = 'isFail';
          if (error.name === 'ClientOrNetworkError') {
            registrationDialogRef.componentInstance.message = 'A client-side or network error occurred!';
          } else if (
            error.message.includes('Your email address already exists in our database.') ||
            error.message.includes('Your social insurance number already exists in our database.') ||
            error.message.includes("The joint member's social insurance number already exists in our database.")
          ) {
            registrationDialogRef.componentInstance.message = `${error.message} Please check your information and try again.`;
          } else if (error.message.includes('User validation failed')) {
            registrationDialogRef.componentInstance.message =
              'Error: Some fields are invalid! Please check your information and try again.';
          } else {
            registrationDialogRef.componentInstance.message = 'A server error occured! Please try again later.';
          }
        },

        () => {
          registrationDialogRef.componentInstance.dialogTitle = 'Done!';
          registrationDialogRef.componentInstance.dialogIcon = 'cloud_done';
          registrationDialogRef.componentInstance.resgistrationStatus = 'isSuccess';
          registrationDialogRef.componentInstance.message = 'Congratulations! Your account has been successfully created!';
        },
      ),
    );
  }
}
