import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { KycService } from './kyc.service';
import { ApiTags } from '@nestjs/swagger';
import { KycQuery, KycUpdate } from './kyc.dto';
import { Auth } from 'decorators/auth.decorator';

@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @Auth('ADMIN')
  getListKyc(@Query() query: KycQuery) {
    return this.kycService.findAll(query);
  }

  @Patch()
  @Auth('ADMIN')
  update(@Body() body: KycUpdate) {
    return this.kycService.update(body);
  }
}