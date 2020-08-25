import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  login: {
    email: string;
    password: string;
  };
  mainHolder: {
    membershipType: string;
    accountType: string;
    title: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    address: string;
    country: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
    socialInsuranceNumber: string;
    profession?: string;
    employer?: string;
    employerPhoneNumber?: string;
  };
  jointMember?: {
    title: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    city: string;
    province: string;
    postalCode: string;
    relationship: string;
    socialInsuranceNumber: string;
    profession?: string;
  };
}

const loginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { _id: false },
);

const mainHolderSchema = new mongoose.Schema(
  {
    membershipType: { type: String, required: true },
    accountType: { type: String, required: true },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDay: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    socialInsuranceNumber: { type: String, required: true },
    profession: { type: String, required: false },
    employer: { type: String, required: false },
    employerPhoneNumber: { type: String, required: false },
  },
  { _id: false },
);

const jointMemberSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    relationship: { type: String, required: true },
    socialInsuranceNumber: { type: String, required: true },
    profession: { type: String, required: false },
  },
  { _id: false },
);

const schema = new mongoose.Schema({
  login: { type: loginSchema, required: true },
  mainHolder: { type: mainHolderSchema, required: true },
  jointMember: {
    type: jointMemberSchema,
    required(this: IUser): boolean {
      return this.mainHolder ? this.mainHolder.accountType === 'Joint' : false;
    },
  },
});

schema.index({ 'login.email': 1 }, { unique: true });
schema.index({ 'mainHolder.socialInsuranceNumber': 1 }, { unique: true });
schema.index({ 'jointMember.socialInsuranceNumber': 1 }, { unique: true, sparse: true });

// tslint:disable-next-line: variable-name
const User = mongoose.model<IUser>('User', schema, 'users');

export default User;
