import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis-client.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<string>('REDIS_PORT', '6379')),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          lazyConnect: false,
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
          retryStrategy: (times: number) => Math.min(times * 200, 2000),
        });

        // swallow connection errors — callers must handle Redis being down
        client.on('error', () => undefined);

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisClientModule {}
