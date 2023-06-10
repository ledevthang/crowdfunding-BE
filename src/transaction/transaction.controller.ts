import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ChangeTransactionStatusDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  
  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createTransactionDto: CreateTransactionDto, @Res() res: Response) : Promise<Response> {
    try {
      const creatorId = req.user.id;
      const success = await this.transactionService.create(creatorId, createTransactionDto);
      return res.status(HttpStatus.OK).json({success});
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Patch('status/:id')
  async updateStatus(@Request() req, @Param('id') id: string, @Body() changeTransactionStatusDto: ChangeTransactionStatusDto, @Res() res: Response) : Promise<Response> {
    try {
      const roleId = req.user.roleId
      if (roleId === 1) {
        const success = await this.transactionService.changeStatus(+id, changeTransactionStatusDto);
        return res.status(HttpStatus.OK).json({success});
      } else {
        throw new UnauthorizedException()
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
