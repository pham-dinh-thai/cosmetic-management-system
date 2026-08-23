export type AccessTokenPayload = {
  sub: string;
  email: string;
  roleId: string;
};

export type RefreshTokenPayload = {
  sub: string;
};

export interface ISignTokenPort {
  signAccessToken(payload: AccessTokenPayload): string;

  signRefreshToken(payload: RefreshTokenPayload): string;
}

export const SIGN_TOKEN_PORT = 'ISignTokenPort';
