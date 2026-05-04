import { ApiProperty } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateConversationDto extends CreateConversationDto {
  @ApiProperty({
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    description: 'Array of message IDs',
    type: [String],
  })
  @IsUUID('all', { each: true, message: 'Enter valid uuids' })
  messageIds: string[];
}
