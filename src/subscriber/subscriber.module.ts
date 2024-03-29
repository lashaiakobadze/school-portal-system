import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscriberController } from './subscriber.controller';
 
@Module({
  imports: [ConfigModule],
  controllers: [SubscriberController],
  providers: [
    {
      provide: 'SUBSCRIBERS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');
 
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      inject: [ConfigService],
    }
  ],
//   providers: [
//     {
//       provide: 'SUBSCRIBERS_SERVICE',
//       useFactory: (configService: ConfigService) => (
//         ClientProxyFactory.create({
//           transport: Transport.TCP,
//           options: {
//             host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
//             port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
//           }
//         })
//       ),
//       inject: [ConfigService],
//     }
//   ],
})
export class SubscriberModule {}
