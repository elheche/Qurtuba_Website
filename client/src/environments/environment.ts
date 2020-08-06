// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// tslint:disable: no-magic-numbers

export const environment = {
  production: false,
  inputs: {
    userAgreementStep0: {
      errorMessages: {
        required: 'You must agree to the terms and conditions to continue.',
      },
      requiredInformations: [
        'Your social insurance number.',
        'Your bank information.',
        "Your employer's full information (if you plan to choose to contribute by payroll deductions).",
      ],
      checkBoxText:
        'I consent to the Privacy Policy and confirm that I am between the ages of 18 and 70 and reside in Quebec.',
    },
    email: {
      errorMessages: {
        required: 'You must enter a valid email address.',
        pattern: 'Invalid email.',
      },
      readonly: true,
    },
    password: {
      errorMessages: {
        required: 'You must enter a password.',
        pattern:
          'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.',
      },
      readonly: true,
    },
    confirmPassword: {
      errorMessages: {
        required: 'You must confirm the password.',
        noPassswordMatch: 'Error: password and confirm password do not match.',
      },
      readonly: true,
    },
    membershipType: {
      errorMessages: {
        required: 'You must choose the type of the membership.',
      },
      types: ['Buy a house', 'Investment'],
      readonly: true,
    },
    accountType: {
      errorMessages: {
        required: 'You must choose the type of the account.',
      },
      types: ['Individual', 'Joint'],
      readonly: true,
    },
    firstName: {
      errorMessages: {
        required: 'You must enter a first name.',
      },
      readonly: true,
    },
    lastName: {
      errorMessages: {
        required: 'You must enter a last name.',
      },
      readonly: true,
    },
    birthDay: {
      errorMessages: {
        required: 'Invalid date.',
        belowMinimumDateLimit: 'The minimum date allowed is 01/01/1900.',
        aboveMaximumDateLimit: 'You must be at least 18 years old!',
      },
      acceptedRange: {
        minDate: '1900-01-01',
        // User must be at least 18 years old
        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10),
      },
      readonly: true,
    },
    phoneNumber: {
      errorMessages: {
        required: 'You must enter a phone number.',
        pattern: 'Invalid phone number.',
      },
      readonly: true,
    },
    address: {
      errorMessages: {
        required: 'You must enter an address.',
      },
      readonly: true,
    },
    city: {
      errorMessages: {
        required: 'You must enter a city.',
      },
      readonly: true,
    },
    country: {
      errorMessages: {
        required: 'You must choose a country.',
      },
      readonly: true,
    },
    province: {
      errorMessages: {
        required: 'You must choose a province.',
      },
      readonly: true,
    },
    postalCode: {
      errorMessages: {
        required: 'You must enter a valid postal code.',
        pattern: 'Invalid postal code.',
      },
      readonly: true,
    },
    socialInsuranceNumber: {
      errorMessages: {
        required: 'You must enter a social insurance number (SIN).',
        pattern: 'Invalid social insurance number (SIN).',
      },
      readonly: true,
    },
    citizenship: {
      errorMessages: {
        required: 'You must choose a citizenship.',
      },
      readonly: true,
    },
    profession: {
      errorMessages: {
        required: 'You must enter a profession.',
      },
      readonly: true,
    },
    employer: {
      errorMessages: {
        required: 'You must enter an employer.',
      },
      readonly: true,
    },
    employerPhoneNumber: {
      errorMessages: {
        required: 'You must enter an employer phone number.',
        pattern: 'Invalid phone number.',
      },
      readonly: true,
    },
    numberOfDependents: {
      errorMessages: {
        required: 'You must enter the number of your dependents.',
      },
      readonly: true,
    },
    depositAmount: {
      errorMessages: {
        required: 'You must enter your deposit amount.',
      },
      readonly: true,
    },
    donationForMosque: {
      errorMessages: {
        required: 'You must enter your donation amount for mosque.',
      },
      readonly: true,
    },
    membershipFee: {
      defaultAmount: 75,
      readonly: true,
    },
    totalAmount: {
      readonly: true,
    },
    relationship: {
      errorMessages: {
        required: 'You must enter a relationship.',
      },
      types: [
        'Aunt',
        'Brother-in-law',
        'Brother',
        'Cousin',
        'Daughter-in-law',
        'Daughter',
        'Ex-husband',
        'Ex-wife',
        'Father-in-law',
        'Father',
        'Fiancé',
        'Fiancée',
        'Friend',
        'Grand-daughter',
        'Grand-father',
        'Grand-mother',
        'Grandson',
        'Great grand-father',
        'Great grand-mother',
        'Half-brother',
        'Half-sister',
        'Husband',
        'Mother in-law',
        'Mother',
        'Nephew',
        'Niece',
        'Sister in-law',
        'Sister',
        'Son-in-law',
        'Son',
        'Step-daughter',
        'Step-father',
        'Step-mother',
        'Step-son',
        'Uncle',
        'Wife',
      ],
      readonly: true,
    },
    userAgreementStepDone: {
      errorMessages: {
        required: 'You must accept the regulation.',
      },
      checkBoxText: {
        individual: 'I have read the Regulations and By-laws of the "Co-operative" and I fully agree to abide by them.',
        joint: 'We have read the Regulations and By-laws of the "Co-operative" and We fully agree to abide by them.',
      },
      readonly: true,
    },
  },
  registration: {
    batchLength: 8,
  },
  userProfil: {
    tabs: {
      loginTab: 0,
      personalTab: 1,
      jointMemberTab: 2,
    },
    forms: {
      registrationFormStep1: 0,
      registrationFormStep2: 1,
      registrationFormStep3: 2,
      registrationFormStep4: 3,
    },
    snackbarDuration: 3000,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
