import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { User } from 'decorators/user.decorator';
import {
  CreateTransactionDto,
  FindTransactionDto,
  UpdateTransactionDto
} from './transaction.dto';
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
  // @Auth('ADMIN')
  async find(@Query() findTransactionDto: FindTransactionDto) {
    return this.transactionService.find(findTransactionDto);
  }

  @Patch()
  @Auth('ADMIN')
  async update(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(updateTransactionDto);
  }

  @Get('/self')
  @Auth('INVESTOR')
  async findSelf(
    @Query() findTransactionDto: FindTransactionDto,
    @User('id') userId: number
  ) {
    return this.transactionService.find(findTransactionDto, userId);
  }

  @Get('/:id')
  @Auth()
  async findOne(@Param('id') id: number, @User('id') userId: number) {
    return this.transactionService.findOne(id, userId);
  }
}
