import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() authSignupDto: AuthSignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(
      authSignupDto.name,
      authSignupDto.email,
      authSignupDto.password,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });

    return { message: 'User registered successfully' };
  }

  @Post('signin')
  async signin(
    @Body() authSigninDto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.signin(
      authSigninDto.email,
      authSigninDto.password,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });

    return { message: 'User signed in successfully' };
  }
}
