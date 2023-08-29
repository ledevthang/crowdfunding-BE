import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './_modules_/user/user.module';
import { PrismaModule } from './_modules_/prisma/prisma.module';
import { AuthModule } from './_modules_/auth/auth.module';
import { CampaignModule } from './_modules_/campaign/campaign.module';
import { CategoryModule } from './_modules_/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/.${process.env.APP || 'local'}.env`,
      isGlobal: true
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    CampaignModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
