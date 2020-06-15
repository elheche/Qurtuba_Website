import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import User from '../user';

@injectable()
export class DatabaseService {
  private options: mongoose.ConnectionOptions;
  private uri: string;

  constructor() {
    dotenv.config();

    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    this.uri = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';

    mongoose.connect(this.uri, this.options).then(
      () => { console.log('Connected to the database.'); },
      (error) => {
        console.error(error);
        process.exit(1);
      }
    );
  }

  async getAllDrawings(): Promise<mongoose.Document[]> {
    return new Promise((resolve, reject) => {
      User.find({}, (err, res) => {
        if (err) {
          reject(err.message);
        } else {
          if (res.length === 0) {
            reject('La base de données est vide!!!');
          } else {
            resolve(res);
          }
        }
      });
    });
  }
}