import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateBankDto, FindBankDto } from './bank.dto';
import { BankService } from './bank.service';
import { Auth } from 'decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('bank')
@ApiTags('Bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  @Auth('ALL')
  findAll(@Query() findBankDto: FindBankDto) {
    return this.bankService.findAll(findBankDto);
  }

  @Post()
  @Auth('ADMIN')
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }
}
