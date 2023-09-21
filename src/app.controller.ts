import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kyc-mock')
  getKyc(@Query('userId') userId: number) {
    return this.appService.kycMock(userId);
  }
}
