import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<Boolean> {
    try {
      const { name, email, password } = createUserDto;
      const userExists = await this.findOneByEmail(email);
      if (userExists) {
        throw new BadRequestException('User already exists');
      }
      const salt = +process.env.HASH_SALT;
      const hash = await bcrypt.hash(password, salt);
      const user = { name, email, password: hash };
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      throw error;
    }
  }

  find() {
    return `This action returns all user`;
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
      });
      const { name, email } = user;
      const responseUser = { id, name, email } as ResponseUserDto;
      return responseUser;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email: string, password: string): Promise<User> {
    try {
      const findUser = await this.findOneByEmail(email);
      const isMatch = await bcrypt.compare(password, findUser.password);
      return isMatch ? findUser : null;
    } catch (error) {
      throw error;
    }
  }
}
