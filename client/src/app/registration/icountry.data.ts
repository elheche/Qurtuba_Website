export interface ICountry {
  countryName: string;
  countryShortCode: string;
  postalCodeRegEx: string;
  regions: { name: string; shortCode: string }[];
}
