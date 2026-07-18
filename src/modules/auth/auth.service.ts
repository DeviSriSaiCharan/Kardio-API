import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@modules/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string) {
    const user: User = await this.usersService.createUser(
      name,
      email,
      password,
    );

    const token = this.generateToken(user);

    return token;
  }

  async signin(email: string, password: string) {
    const user: User = await this.usersService.getUserByEmail(email);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user);

    return { token };
  }

  private generateToken(user: User) {
    const payload = { userId: user.id, email: user.email };

    const token = this.jwtService.sign(payload, { expiresIn: '2d' });
    return token;
  }
}
