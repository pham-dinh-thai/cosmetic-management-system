import { Position } from '@app/security';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  roleId: string;
  departmentCode?: string;
  position?: Position;
};

export type RefreshTokenPayload = {
  sub: string;
};

export interface ISignTokenPort {
  signAccessToken(payload: AccessTokenPayload): string;

  signRefreshToken(payload: RefreshTokenPayload): string;

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null>;
}

export const SIGN_TOKEN_PORT = 'ISignTokenPort';
