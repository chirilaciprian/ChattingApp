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
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Conversation } from './entities/conversation.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Conversation')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    const conversation = await this.conversationService.create(
      createConversationDto,
    );
    return plainToInstance(Conversation, conversation);
  }

  @Get()
  async findAll() {
    const conversations = await this.conversationService.findAll();
    return conversations;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const conversation = await this.conversationService.findOne(id);
    return plainToInstance(Conversation, conversation);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    const conversation = await this.conversationService.update(
      id,
      updateConversationDto,
    );
    return plainToInstance(Conversation, conversation);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const conversation = await this.conversationService.remove(id);
    return plainToInstance(Conversation, conversation);
  }
}
