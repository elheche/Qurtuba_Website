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
    errorMessages: {
      email: {
        required: 'You must enter an email address.',
        email: 'Invalid email.'
      },
      password: {
        required: 'You must enter a password.',
        pattern: 'Invalid password. It must contain at least 8 characters with at least 1 numeric character, 1 uppercase letter, 1 lowercase letter and 1 special character.'
      },
      confirmPassword: {
        required: 'You must confirm your password.',
        noPassswordMatch: 'Error: your password and confirm password do not match.'
      },
      membershipType: {
        required: 'You must choose the type of your membership.'
      },
      accountType: {
        required: 'You must choose the type of your account.'
      },
      firstName: {
        required: 'You must enter your first name.'
      },
      lastName: {
        required: 'You must enter your last name.'
      },
      birthDay: {
        required: 'Invalid date.',
        belowMinimumDateLimit: 'The minimum date allowed is 01/01/1900.',
        aboveMaximumDateLimit: 'You must be at least 18 years old!'
      },
      phoneNumber: {
        required: 'You must enter your phone number.',
        pattern: 'Invalid phone number.'
      },
      address: {
        required: 'You must enter your address.'
      },
      city: {
        required: 'You must enter the city of your address.'
      },
      country: {
        required: 'You must choose the country of your address.'
      },
      province: {
        required: 'You must choose the province of your address.'
      },
      postalCode: {
        required: 'You must enter the postal code of your address.',
        pattern: 'Invalid postal code.'
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
