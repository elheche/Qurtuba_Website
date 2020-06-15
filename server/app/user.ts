import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// tslint:disable-next-line: variable-name
const User = mongoose.model('User', schema);

export default User;