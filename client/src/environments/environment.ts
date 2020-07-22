// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// tslint:disable: no-magic-numbers

export const environment = {
  production: false,
  inputs: {
    email: {
      errorMessages: {
        required: 'You must enter a valid email address.',
        email: 'Invalid email.'
      },
      readonly: true
    },
    password: {
      errorMessages: {
        required: 'You must enter a password.',
        pattern: 'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.'
      },
      readonly: true
    },
    confirmPassword: {
      errorMessages: {
        required: 'You must confirm the password.',
        noPassswordMatch: 'Error: password and confirm password do not match.'
      },
      readonly: false
    },
    membershipType: {
      errorMessages: {
        required: 'You must choose the type of the membership.'
      },
      types: [
        'Buy a house',
        'Investment'
      ],
      readonly: true
    },
    accountType: {
      errorMessages: {
        required: 'You must choose the type of the account.'
      },
      types: [
        'Individual',
        'Joint'
      ],
      readonly: true
    },
    firstName: {
      errorMessages: {
        required: 'You must enter a first name.'
      }
    },
    lastName: {
      errorMessages: {
        required: 'You must enter a last name.'
      }
    },
    birthDay: {
      errorMessages: {
        required: 'Invalid date.',
        belowMinimumDateLimit: 'The minimum date allowed is 01/01/1900.',
        aboveMaximumDateLimit: 'You must be at least 18 years old!'
      },
      acceptedRange: {
        minDate: '1900-01-01',
        // User must be at least 18 years old
        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10)
      }
    },
    phoneNumber: {
      errorMessages: {
        required: 'You must enter a phone number.',
        pattern: 'Invalid phone number.'
      }
    },
    address: {
      errorMessages: {
        required: 'You must enter an address.'
      }
    },
    city: {
      errorMessages: {
        required: 'You must enter a city.'
      }
    },
    country: {
      errorMessages: {
        required: 'You must choose a country.'
      }
    },
    province: {
      errorMessages: {
        required: 'You must choose a province.'
      }
    },
    postalCode: {
      errorMessages: {
        required: 'You must enter a valid postal code.',
        pattern: 'Invalid postal code.'
      }
    },
    socialInsuranceNumber: {
      errorMessages: {
        required: 'You must enter a social insurance number (SIN).',
        pattern: 'Invalid social insurance number (SIN).'
      }
    },
    citizenship: {
      errorMessages: {
        required: 'You must choose a citizenship.',
      }
    },
    profession: {
      errorMessages: {
        required: 'You must enter a profession.',
      }
    },
    employer: {
      errorMessages: {
        required: 'You must enter an employer.',
      }
    },
    employerPhoneNumber: {
      errorMessages: {
        required: 'You must enter an employer phone number.',
        pattern: 'Invalid phone number.'
      }
    },
    numberOfDependents: {
      errorMessages: {
        required: 'you must enter the number of your dependents.',
      }
    },
    depositAmount: {
      errorMessages: {
        required: 'you must enter your deposit amount.',
      }
    },
    donationForMosque: {
      errorMessages: {
        required: 'you must enter your donation amount for mosque.',
      }
    },
    membershipFee: {
      defaultAmount: 75
    },
    relationship: {
      errorMessages: {
        required: 'you must enter a relationship.',
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
      ]
    },
    userAgreement: {
      errorMessages: {
        required: 'you must accept the regulation.',
      },
      text: {
        individual: 'I have read the Regulations and By-laws of the "Co-operative" and I fully agree to abide by them.',
        joint: 'We have read the Regulations and By-laws of the "Co-operative" and We fully agree to abide by them.'
      }
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
