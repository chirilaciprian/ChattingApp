import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto {
  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'Avatar URL of the conversation',
    type: String,
  })
  @IsOptional()
  @IsString()
  avatarUrl: string;

  @ApiProperty({
    example: false,
    description: 'Whether the conversation is a group conversation',
    type: Boolean,
  })
  @IsBoolean()
  isGroup: boolean;

  @ApiProperty({
    example: 'Conversation Name',
    description: 'Name of the conversation',
    type: String,
  })

  @IsString()
  name: string;
}
