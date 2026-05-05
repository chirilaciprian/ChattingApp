import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'Avatar URL of the conversation',
    type: String,
  })
  @IsOptional()
  @IsString()
  avatarUrl: string;
}
