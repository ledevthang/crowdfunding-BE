import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './_modules_/user/user.module';
import { PrismaModule } from './_modules_/prisma/prisma.module';
import { AuthModule } from './_modules_/auth/auth.module';
import { CampaignModule } from './_modules_/campaign/campaign.module';
import { CategoryModule } from './_modules_/category/category.module';
import { S3Module } from 'nestjs-s3';
import { FileModule } from '_modules_/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/.${process.env.APP || 'local'}.env`,
      isGlobal: true
    }),
    S3Module.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          region: configService.get<string>('AWS_BUCKET_REGION'),
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
        }
      }),
      inject: [ConfigService]
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    CampaignModule,
    CategoryModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
