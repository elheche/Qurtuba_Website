// tslint:disable: no-magic-numbers

export const environment = {
  production: true,
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
    },
    reCaptcha: {
      errorMessages: {
        required: 'You must resolve the reCAPTCHA to continue.',
      },
      siteKey: '6LebULwZAAAAAMnP3RJz59YQCgFJ6QxXrteQInpj',
      language: 'en',
    },
    email: {
      errorMessages: {
        required: 'You must enter a valid email address.',
        pattern: 'Invalid email.',
      },
    },
    password: {
      errorMessages: {
        required: 'You must enter a password.',
        pattern:
          'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.',
      },
      hintLabel:
        'Your password must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.',
    },
    confirmPassword: {
      errorMessages: {
        required: 'You must confirm the password.',
        noPassswordMatch: 'Error: password and confirm password do not match.',
      },
    },
    membershipType: {
      errorMessages: {
        required: 'You must choose the type of the membership.',
      },
      types: ['Buy a house', 'Investment'],
    },
    accountType: {
      errorMessages: {
        required: 'You must choose the type of the account.',
      },
      types: ['Individual', 'Joint'],
    },
    title: {
      errorMessages: {
        required: 'Invalid title.',
      },
      titles: ['Mr.', 'Ms.', 'Mrs.', 'Miss'],
    },
    firstName: {
      errorMessages: {
        required: 'You must enter a first name.',
      },
    },
    lastName: {
      errorMessages: {
        required: 'You must enter a last name.',
      },
    },
    birthDay: {
      errorMessages: {
        required: 'Invalid date.',
        belowMinimumDateLimit: 'The minimum date allowed is 01/01/1900.',
      },
      acceptedRange: {
        minDate: '1900-01-01',
      },
    },
    address: {
      errorMessages: {
        required: 'You must enter an address.',
      },
    },
    country: {
      errorMessages: {
        required: 'You must choose a country.',
      },
    },
    city: {
      errorMessages: {
        required: 'You must enter a city.',
      },
    },
    province: {
      errorMessages: {
        required: 'You must choose a province.',
      },
    },
    postalCode: {
      errorMessages: {
        required: 'You must enter a valid postal code.',
        pattern: 'Invalid postal code.',
      },
    },
    phoneNumber: {
      errorMessages: {
        required: 'You must enter a phone number.',
        invalidPhoneNumber: 'Invalid phone number.',
      },
      maxLength: 17,
    },
    socialInsuranceNumber: {
      errorMessages: {
        required: 'You must enter a social insurance number.',
        invalidSocialInsuranceNumber: 'Invalid social insurance number.',
      },
      tooltip: `Do I need to provide my social insurance number?
         The Canada Revenue Agency requires that you provide your SIN to anyone who issues a tax slip in your name.
         Visit the Service Canada site for more information on how to use your social insurance number.`,
    },
    profession: {
      errorMessages: {
        required: 'You must enter a profession.',
      },
    },
    employer: {
      errorMessages: {
        required: 'You must enter an employer.',
      },
    },
    employerPhoneNumber: {
      errorMessages: {
        required: 'You must enter an employer phone number.',
        invalidPhoneNumber: 'Invalid phone number.',
      },
      maxLength: 17,
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
    },
    sameAddressCheckBox: {
      checkBoxText: 'Same as the main holder address.',
    },
    userAgreementStepDone: {
      errorMessages: {
        required: 'You must accept the regulation.',
      },
      checkBoxText: {
        individual: 'I have read the Regulations and By-laws of the "Co-operative" and I fully agree to abide by them.',
        joint: 'We have read the Regulations and By-laws of the "Co-operative" and We fully agree to abide by them.',
      },
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
  serverUrl: 'https://qurtuba-server.herokuapp.com',
};
