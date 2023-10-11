import { Job, JobSchema } from 'src/job/schemas/job.schema';
import { Subscriber, SubscriberSchema } from './../subscribers/schemas/subscriber.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          secure: false,
          auth: {
            user: configService.get<string>("EMAIL_AUTH_USER"),
            pass: configService.get<string>("EMAIL_AUTH_PASS"),
          },
        },

        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

        preview: configService.get<string>("EMAIL_PREVIEW") === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobSchema },
    ])
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }
