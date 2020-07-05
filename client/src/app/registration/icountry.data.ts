export interface ICountry {
  countryName: string,
  countryShortCode: string,
  regions: { name: string, shortCode: string }[]
}
