import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Participant } from 'src/participant/entities/participant.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Participant) private participantRepository: Repository<Participant>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) { }
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdBy = await this.participantRepository.findOne({
      where: { id: createMessageDto.participantId },
    });
    if (!createdBy) {
      throw new NotFoundException('Participant id not found');
    }
    const conversation = await this.conversationRepository.findOneBy({
      id: createMessageDto.conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation id not found');
    }
    const message = this.messageRepository.create({
      data: createMessageDto.data,
      conversation: conversation,
      createdBy: createdBy,
    });
    const savedMessage = await this.messageRepository.save(message);
    this.logger.log(`Message created: ${savedMessage.id}`);
    return savedMessage;
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const createdBy = await this.participantRepository.findOneBy({ id: updateMessageDto.participantId });
    if (!createdBy) {
      throw new NotFoundException('Participant id not found');
    }
    const conversation = await this.conversationRepository.findOneBy({
      id: updateMessageDto.conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const message = await this.messageRepository.preload({
      id,
      conversation: conversation,
      createdBy: createdBy,
      data: updateMessageDto.data,
      isRead: updateMessageDto.isRead,
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    const updatedMessage = await this.messageRepository.save(message);
    this.logger.log(`Message updated: ${updatedMessage.id}`);
    return updatedMessage;
  }

  async remove(id: string): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    await this.messageRepository.delete(id);
    this.logger.log(`Message deleted: ${message.id}`);
    return message;
  }
}
