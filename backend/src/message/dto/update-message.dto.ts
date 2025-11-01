import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsBoolean } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the message has been read',
  })
  @IsBoolean()
  isRead: boolean;
}
