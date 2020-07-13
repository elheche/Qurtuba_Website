// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// tslint:disable: no-magic-numbers

export const environment = {
  production: false,
  registration: {
    membershipTypes: [
      'Buy a house',
      'Investment'
    ],
    accountTypes: [
      'Individual',
      'Joint'
    ],
    birthDateRange: {
      minDate: '1900-01-01',
      // User must be at least 18 years old
      maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10)
    },
    membershipFeeDefaultAmount: 75,
    relationshipTypes: [
      'Spouse',
      'Fiance(e)'
    ],
    errorMessages: {
      email: {
        required: 'You must enter a valid email address.',
        email: 'Invalid email.'
      },
      password: {
        required: 'You must enter a password.',
        pattern: 'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.'
      },
      confirmPassword: {
        required: 'You must confirm the password.',
        noPassswordMatch: 'Error: password and confirm password do not match.'
      },
      membershipType: {
        required: 'You must choose the type of the membership.'
      },
      accountType: {
        required: 'You must choose the type of the account.'
      },
      firstName: {
        required: 'You must enter a first name.'
      },
      lastName: {
        required: 'You must enter a last name.'
      },
      birthDay: {
        required: 'Invalid date.',
        belowMinimumDateLimit: 'The minimum date allowed is 01/01/1900.',
        aboveMaximumDateLimit: 'You must be at least 18 years old!'
      },
      phoneNumber: {
        required: 'You must enter a phone number.',
        pattern: 'Invalid phone number.'
      },
      address: {
        required: 'You must enter an address.'
      },
      city: {
        required: 'You must enter a city.'
      },
      country: {
        required: 'You must choose a country.'
      },
      province: {
        required: 'You must choose a province.'
      },
      postalCode: {
        required: 'You must enter a valid postal code.',
        pattern: 'Invalid postal code.'
      },
      socialInsuranceNumber: {
        required: 'You must enter a social insurance number (SIN).',
        pattern: 'Invalid social insurance number (SIN).'
      },
      citizenship: {
        required: 'You must choose a citizenship.',
      },
      profession: {
        required: 'You must enter a profession.',
      },
      employer: {
        required: 'You must enter an employer.',
      },
      employerPhoneNumber: {
        required: 'You must enter an employer phone number.',
        pattern: 'Invalid phone number.'
      },
      numberOfDependents: {
        required: 'you must enter the number of your dependents.',
      },
      depositAmount: {
        required: 'you must enter your deposit amount.',
      },
      donationForMosque: {
        required: 'you must enter your donation amount for mosque.',
      },
      relationship: {
        required: 'you must choose a relationship.',
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
