import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) // private readonly userService: UserService,
  {}
  async create(creatorId: number, createTransactionDto: CreateTransactionDto) {
    try {
      const {
        amount,
        bankName,
        bankAccountNumber,
        bankerName,
        bankerAddress,
        bankerPhone,
        bankerZipCode,
        bankerEmail,
        note,
        campaignId,
      } = createTransactionDto;
      const creator = await this.userRepository.findOne({
        where: { id: creatorId },
      });

      const transaction = {
        amount,
        bankName,
        bankAccountNumber,
        bankerName,
        bankerAddress,
        bankerPhone,
        bankerZipCode,
        bankerEmail,
        note,
        campaignId,
        users: [creator],
      };
      console.log('create transaction', transaction);
      const createdTransaction = this.transactionRepository.create(transaction);
      const success = this.transactionRepository.save(createdTransaction);
      return success;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
