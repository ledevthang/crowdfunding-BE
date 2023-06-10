import { Injectable } from '@nestjs/common';
import { ChangeTransactionStatusDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { transactionStatus } from 'src/base/enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) // private readonly userService: UserService,
  {}
  async create(creatorId: number, createTransactionDto: CreateTransactionDto) : Promise<Boolean> {
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
      const creator = await this.userService.findOne(creatorId)
      // const creator = await this.userRepository.findOne({
      //   where: { id: creatorId },
      // });

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
      const createdTransaction = this.transactionRepository.create(transaction);
      this.transactionRepository.save(createdTransaction);
      return true;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all transaction`;
  }

  async findOne(id: number) : Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOne({where: {id: id}, relations: ['users']});
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async changeStatus(id: number, changeTransactionStatusDto: ChangeTransactionStatusDto) : Promise<Boolean> {
    try {
      const {status} = changeTransactionStatusDto
      const transaction = await this.findOne(id)
      transaction.status = status
      await this.transactionRepository.save(transaction);
      return true
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
