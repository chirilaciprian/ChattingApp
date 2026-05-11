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
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Conversation } from './entities/conversation.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiKeyGuard } from 'src/common/guards/apikey,guard';

@ApiBearerAuth()
@ApiSecurity('x-api-key')
@UseGuards(AuthGuard)
@ApiTags('Conversation')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @UseGuards(ApiKeyGuard)
  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    const conversation = await this.conversationService.create(
      createConversationDto,
    );
    return plainToInstance(Conversation, conversation);
  }

  @UseGuards(ApiKeyGuard)
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

  @Get('user/:userId')
  async findByUserId(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const conversations = await this.conversationService.findByUserId(userId);
    return conversations;
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

  @UseGuards(ApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const conversation = await this.conversationService.remove(id);
    return plainToInstance(Conversation, conversation);
  }
}
