import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return await this.userService.create(registerDto);
  }

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(
      signinDto.username,
      signinDto.password,
    );
    return await this.authenticate(user);
  }

  async authenticate(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid username or password');
    }
    return user;
  }
}
