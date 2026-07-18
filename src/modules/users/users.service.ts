import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
