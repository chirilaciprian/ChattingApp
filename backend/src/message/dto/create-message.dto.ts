import { IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'UUID of the conversation',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID('all', { message: 'Invalid conversation ID' })
  conversationId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you?',
    minLength: 1,
    maxLength: 500,
  })
  @MinLength(1, { message: 'Message must be at least 1 character long' })
  @MaxLength(500, { message: 'Message must be at most 500 characters long' })
  data: string;

  @ApiProperty({
    description: 'UUID of the user sending the message',
    example: 'a5e1f1ee-6c54-4b01-90e6-d701748f0852',
  })
  @IsUUID('all', { message: 'Invalid user ID' })
  userId: string;
}
