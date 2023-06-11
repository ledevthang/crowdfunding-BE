import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { CampaignModule } from './campaign/campaign.module';
import { TransactionModule } from './transaction/transaction.module';
import { User } from './user/entities/user.entity';
import { Category } from './category/entities/category.entity';
import { Campaign } from './campaign/entities/campaign.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Category, Campaign, Transaction, Role],
      synchronize: true,
      ssl: true,
    }),
    UserModule,
    CategoryModule,
    CampaignModule,
    TransactionModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
