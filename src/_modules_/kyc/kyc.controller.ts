import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'decorators/auth.decorator';
import { User } from 'decorators/user.decorator';
import { KycCreate, KycQuery, KycUpdate } from './kyc.dto';
import { KycService } from './kyc.service';

@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @Auth('ADMIN')
  getListKyc(@Query() query: KycQuery) {
    return this.kycService.findAll(query);
  }

  @Get(':userId')
  @Auth('ADMIN')
  getKyc(@Param('userId') userId: number) {
    return this.kycService.findOne(userId);
  }

  @Patch()
  @Auth('ADMIN')
  update(@Body() body: KycUpdate) {
    return this.kycService.update(body);
  }

  @Post()
  @Auth('NORMAL')
  create(@Body() body: KycCreate, @User('id') userId: number) {
    return this.kycService.create(body, userId);
  }
}
// {
//   "firstName": "none",
//   "lastName": "none",
//   "email": "mtheanh2910@gmail.com",
//   "phoneNumber": "06461650949",
//   "dateOfBirth": "2023-09-11T08:51:40.077Z",
//   "streetAddress": "mumbai",
//   "zip": "2526",
//   "city": "mumbau",
//   "country": "india",
//   "stateProvince": "none",
//   "images": [
//     "https://crowd-founding.s3.ap-southeast-1.amazonaws.com/kyc/7/1694423255745",
//     "https://crowd-founding.s3.ap-southeast-1.amazonaws.com/kyc/7/1694423256592",
//     "https://crowd-founding.s3.ap-southeast-1.amazonaws.com/kyc/7/1694423256772"
//   ]
// }
