import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { User } from 'decorators/user.decorator';
import { CreateTransactionDto, FindTransactionDto } from './transaction.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from 'decorators/auth.decorator';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBody({ type: CreateTransactionDto })
  @Auth('INVESTOR')
  @Post()
  create(
    @User('id') userId: number,
    @Body() createTransactionDto: CreateTransactionDto
  ) {
    return this.transactionService.create(userId, createTransactionDto);
  }

  @Patch('/complete/:id')
  @Auth('INVESTOR')
  async complete(@Param('id') id: number, @User('id') userId: number) {
    return this.transactionService.complete(id, userId);
  }

  

  @Get()
  async find(@Query() findTransactionDto: FindTransactionDto) {
    return this.transactionService.find(findTransactionDto)
  }

  @Get("/self")
  @Auth('INVESTOR')
  async findSelf(@Query() findTransactionDto: FindTransactionDto, @User('id') userId: number) {
    return this.transactionService.find(findTransactionDto, userId)
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.transactionService.findOne(id);
  }
}
