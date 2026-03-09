import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository, In } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { participantIds } = createConversationDto;
    const users = await this.userRepository.findBy({ id: In(participantIds) });
    if (users.length !== participantIds.length) {
      throw new BadRequestException('One or more users not found');
    }
    const conversation = this.conversationRepository.create({
      participants: users,
    });
    const savedConversation =
      await this.conversationRepository.save(conversation);
    this.logger.log(`Conversation created: ${savedConversation.id}`);
    return savedConversation;
  }

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      where: { participants: { id: userId } },
    });
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const { participantIds, messageIds } = updateConversationDto;
    const users = await this.userRepository.findBy({ id: In(participantIds) });
    if (users.length !== participantIds.length) {
      throw new BadRequestException('One or more users not found');
    }
    const messages = await this.messageRepository.findBy({
      id: In(messageIds),
    });
    if (messages.length !== messageIds.length) {
      throw new BadRequestException('One or more messages not found');
    }
    const conversation = await this.conversationRepository.preload({
      id,
      participants: users,
      messages: messages,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const updatedConversation =
      await this.conversationRepository.save(conversation);
    this.logger.log(`Conversation updated: ${updatedConversation.id}`);
    return updatedConversation;
  }

  async remove(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOneBy({ id });
    if (!conversation) {
      throw new NotFoundException('Conversation nout found');
    }
    await this.conversationRepository.delete(id);
    this.logger.log(`Conversation deleted: ${conversation.id}`);
    return conversation;
  }
}
