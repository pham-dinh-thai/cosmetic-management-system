import { Injectable } from '@nestjs/common';
import { IPasswordHasherPort } from '../../application/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasherAdapter implements IPasswordHasherPort {
  public async hash(
    plainText: string,
    saltOrRounds: number | string = 10,
  ): Promise<string> {
    return await bcrypt.hash(plainText, saltOrRounds);
  }

  public async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
