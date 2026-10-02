import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeleteUserPort } from '../../application/use-cases/register/ports/delete-user.port';
import { HttpClient, HttpResponseError } from '@nestjs/http-client';

@Injectable()
export class DeleteUserAdapter implements IDeleteUserPort {
  public constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async execute(userId: string): Promise<boolean> {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    try {
      await this.httpClient.delete(`${url}/api/internal/users/${userId}`);

      return true;
    } catch (error) {
      if (error instanceof HttpResponseError) {
        // Đã bị xoá trước đó: coi như thành công, giữ hành vi của bản fetch.
        if (error.status === 404) {
          return true;
        }

        throw new Error(
          `Failed to delete user: ${error.status} ${error.statusText}`,
          { cause: error },
        );
      }

      throw error;
    }
  }
}
