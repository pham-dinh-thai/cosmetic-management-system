import { Injectable } from '@nestjs/common';
import {
  ICreateUserPort,
  ICreateUserPortRequest,
} from '../../application/use-cases/register/ports/create-user.port';
import { ConfigService } from '@nestjs/config';
import { HttpClient, HttpResponseError } from '@nestjs/http-client';

@Injectable()
export class CreateUserAdapter implements ICreateUserPort {
  public constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async execute(
    request: ICreateUserPortRequest,
  ): Promise<{ id: string }> {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    try {
      const { data } = await this.httpClient.post<{ id: string }>(
        `${url}/api/internal/users`,
        {
          json: request,
        },
      );

      return data;
    } catch (error) {
      if (error instanceof HttpResponseError) {
        throw new Error(
          `Failed to create user: ${error.status} ${error.statusText}`,
          { cause: error },
        );
      }

      throw error;
    }
  }
}
