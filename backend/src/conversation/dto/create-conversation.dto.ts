import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    description: 'Array of user IDs who will participate in the conversation',
    type: [String],
  })
  @ArrayMinSize(2, {
    message: 'The conversation needs at least 2 participants',
  })
  @IsNotEmpty({ message: 'Participants are required' })
  @IsUUID('all', { each: true, message: 'Enter valid uuids' })
  participantIds: string[];

  @ApiProperty({
    example: false,
    description: 'Whether the conversation is a group conversation',
    type: Boolean,
  })
  isGroup: boolean;

  @ApiProperty({
    example: 'Conversation Name',
    description: 'Name of the conversation',
    type: String,
  })

  @IsOptional()
  @IsString()
  name: string;
}
