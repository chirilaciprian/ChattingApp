import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Message } from './entities/message.entity';

@ApiTags('Message')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    return plainToInstance(Message, message);
  }

  @Get()
  async findAll() {
    const messages = await this.messageService.findAll();
    return messages;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const message = await this.messageService.findOne(id);
    return plainToInstance(Message, message);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messageService.update(id, updateMessageDto);
    return plainToInstance(Message, message);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const message = await this.messageService.remove(id);
    return plainToInstance(Message, message);
  }
}
