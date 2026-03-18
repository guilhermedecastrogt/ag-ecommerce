import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../application/interfaces/password-hasher.interface';

@Injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    try {
      if (await argon2.verify(hash, password)) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}
