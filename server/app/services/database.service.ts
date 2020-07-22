import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import User, { IUser } from '../user';

@injectable()
export class DatabaseService {
  private options: mongoose.ConnectionOptions;
  private uri: string;

  constructor() {
    dotenv.config();

    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    this.uri = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';

    mongoose.connect(this.uri, this.options).then(
      () => {
        console.log('Connected to the database server.');
      },
      (error) => {
        console.error(error);
        process.exit(1);
      },
    );
  }

  async getAllUsers(): Promise<mongoose.Document[]> {
    return new Promise((resolve, reject) => {
      User.find({}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async getUser(userData: IUser): Promise<mongoose.Document> {
    return new Promise((resolve, reject) => {
      User.findOne({ email: userData.email }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (!res) {
            reject(new mongoose.Error('Invalid email.'));
          } else {
            if (userData.password !== res.password) {
              reject(new mongoose.Error('Invalid password.'));
            } else {
              resolve(res);
            }
          }
        }
      });
    });
  }

  async addUser(userData: IUser): Promise<mongoose.Document> {
    return new Promise((resolve, reject) => {
      const user = new User(userData);
      user.save((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async deleteUser(userId: string): Promise<mongoose.Document> {
    return new Promise((resolve, reject) => {
      User.findByIdAndDelete(userId, (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (!res) {
            reject(new mongoose.Error('User not found.'));
          } else {
            resolve(res);
          }
        }
      });
    });
  }
}
