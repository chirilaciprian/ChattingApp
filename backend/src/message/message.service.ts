import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { userId, conversationId, data } = createMessageDto;
    const createdBy = await this.userRepository.findOneBy({ id: userId });
    if (!createdBy) {
      throw new NotFoundException('User id not found');
    }
    const conversation = await this.conversationRepository.findOneBy({
      id: conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation id not found');
    }
    const message = this.messageRepository.create({
      data,
      conversation,
      createdBy,
    });
    return await this.messageRepository.save(message);
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

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const { userId, conversationId, data, isRead } = updateMessageDto;
    const createdBy = await this.userRepository.findOneBy({ id: userId });
    if (!createdBy) {
      throw new NotFoundException('User not found');
    }
    const conversation = await this.conversationRepository.findOneBy({
      id: conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const message = await this.messageRepository.preload({
      id,
      conversation,
      createdBy,
      data,
      isRead,
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return await this.messageRepository.save(message);
  }

  async remove(id: string): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    await this.messageRepository.delete(id);
    return message;
  }
}
