import { Injectable } from '@nestjs/common';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasherService implements PasswordHasherPort {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
