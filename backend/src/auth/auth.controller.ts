import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  getUserInfo(@Request() req) {
    return this.authService.getMe(req.user.id);
  }
}
