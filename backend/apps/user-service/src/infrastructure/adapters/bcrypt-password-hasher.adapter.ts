import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../../domain/services/password-hasher.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
