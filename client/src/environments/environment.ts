// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// tslint:disable: no-magic-numbers

export const environment = {
  production: false,
  inputs: {
    userAgreementStep1: {
      errorMessages: {
        required: 'You must agree to the terms and conditions to continue.',
      },
      requiredInformations: [
        'Your social insurance number.',
        'Your bank information.',
        "Your employer's full information (if you plan to choose to contribute by payroll deductions).",
      ],
      checkBoxText: 'I consent to the Privacy Policy and confirm that I am between the ages of 18 and 70 and reside in Quebec.',
      readonly: true,
    },
    reCaptcha: {
      errorMessages: {
        required: 'You must resolve the reCAPTCHA to continue.',
      },
      siteKey: '6LebULwZAAAAAMnP3RJz59YQCgFJ6QxXrteQInpj',
      language: 'en',
      readonly: true,
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
      hintLabel:
        'Your password must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.',
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
    title: {
      errorMessages: {
        required: 'Invalid title.',
      },
      titles: ['Mr.', 'Ms.', 'Mrs.', 'Miss'],
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
      },
      acceptedRange: {
        minDate: '1900-01-01',
      },
      readonly: true,
    },
    address: {
      errorMessages: {
        required: 'You must enter an address.',
      },
      readonly: true,
    },
    country: {
      errorMessages: {
        required: 'You must choose a country.',
      },
      readonly: true,
    },
    city: {
      errorMessages: {
        required: 'You must enter a city.',
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
    phoneNumber: {
      errorMessages: {
        required: 'You must enter a phone number.',
        invalidPhoneNumber: 'Invalid phone number.',
      },
      maxLength: 17,
      readonly: true,
    },
    socialInsuranceNumber: {
      errorMessages: {
        required: 'You must enter a social insurance number.',
        invalidSocialInsuranceNumber: 'Invalid social insurance number.',
      },
      tooltip: `Do I need to provide my social insurance number?
         The Canada Revenue Agency requires that you provide your SIN to anyone who issues a tax slip in your name.
         Visit the Service Canada site for more information on how to use your social insurance number.`,
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
        invalidPhoneNumber: 'Invalid phone number.',
      },
      maxLength: 17,
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
    sameAddressCheckBox: {
      checkBoxText: 'Same as the main holder address.',
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
    snackbarDuration: 4000,
    stepsIndex: {
      step1: 0,
      step2: 1,
      step3: 2,
      step4: 3,
      step5: 4,
    },
  },
  userProfil: {
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
