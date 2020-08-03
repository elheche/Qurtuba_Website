import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  membershipType: string;
  accountType: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  province: string;
  postalCode: string;
  socialInsuranceNumber: string;
  citizenship: string;
  profession: string;
  employer: string;
  employerPhoneNumber: string;
  numberOfDependents: number;
  depositAmount: number;
  donationForMosque: number;
  membershipFee: number;
  totalAmount: number;
  jointMemberFirstName?: string;
  jointMemberLastName?: string;
  jointMemberAddress?: string;
  jointMemberCity?: string;
  jointMemberCountry?: string;
  jointMemberProvince?: string;
  jointMemberPostalCode?: string;
  jointMemberSocialInsuranceNumber?: string;
  jointMemberCitizenship?: string;
  jointMemberProfession?: string;
  jointMemberRelationship?: string;
}

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membershipType: { type: String, required: true },
  accountType: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDay: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  socialInsuranceNumber: { type: String, required: true, unique: true },
  citizenship: { type: String, required: true },
  profession: { type: String, required: true },
  employer: { type: String, required: true },
  employerPhoneNumber: { type: String, required: true },
  numberOfDependents: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  donationForMosque: { type: Number, required: true },
  membershipFee: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  jointMemberFirstName: { type: String },
  jointMemberLastName: { type: String },
  jointMemberAddress: { type: String },
  jointMemberCity: { type: String },
  jointMemberCountry: { type: String },
  jointMemberProvince: { type: String },
  jointMemberPostalCode: { type: String },
  jointMemberSocialInsuranceNumber: { type: String, unique: true },
  jointMemberCitizenship: { type: String },
  jointMemberProfession: { type: String },
  jointMemberRelationship: { type: String },
});

// tslint:disable-next-line: variable-name
const User = mongoose.model<IUser>('User', schema, 'users');

export default User;
