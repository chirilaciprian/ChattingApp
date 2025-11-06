import { ApiProperty } from '@nestjs/swagger';
import { MatchesProperty } from 'src/common/decorators/matches-property.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export class RegisterDto extends CreateUserDto {
  @ApiProperty({
    description: 'Password confirmation',
    example: 'strongPassword123',
  })
  @MatchesProperty('password', { message: 'Confirm password does not match' })
  confirm_password: string;
}
