import { Injectable } from '@nestjs/common';
import { IPasswordHasherPort } from '../../application/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasherService implements IPasswordHasherPort {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
