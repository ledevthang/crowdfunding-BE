import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { User } from 'decorators/user.decorator';
import { CreateTransactionDto } from './transaction.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from 'decorators/auth.decorator';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBody({ type: CreateTransactionDto })
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async complete(@Param('id') id: number, @User('id') userId: number) {
    return this.transactionService.complete(id, userId);
  }
}
