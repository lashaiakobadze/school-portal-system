import { Module } from '@nestjs/common';
import { GraylogModule, GraylogService } from 'nestjs-graylog';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    GraylogModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        servers: [
          {
            host: configService.get('GRAYLOG_HOST'),
            port: +configService.get('GRAYLOG_PORT'),
          },
        ],
        // hostname: 'hostname', // optional, default: os.hostname()
        // facility: configService.get('GRAYLOG_FACILITY'), // optional, default: Node.js
        // bufferSize: 1400, // optional, default: 1400
      }),
    }),
  ],
  providers: [GraylogService],
  exports: [GraylogService],
})
export class GraylogProviderModule {}
