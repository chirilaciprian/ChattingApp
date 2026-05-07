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
import { Participant } from 'src/participant/entities/participant.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) { }

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    ;
    const users = await this.userRepository.findBy({ id: In(createConversationDto.participantIds) });
    if (users.length !== users.length) {
      throw new BadRequestException('One or more users not found');
    }

    return await this.conversationRepository.manager.transaction(async (manager) => {

      const conversation = manager.create(Conversation, { name: createConversationDto.name, isGroup: createConversationDto.isGroup });
      const savedConversation = await manager.save(Conversation, conversation);

      const participants = users.map((user) =>
        manager.create(Participant, {
          user,
          conversation: savedConversation,
          role: user.id === createConversationDto.createdBy ? 'admin' : 'member',
        }),
      );
      await manager.save(Participant, participants);

      this.logger.log(`Conversation created: ${savedConversation.id}`);
      return savedConversation;
    });
  }

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      relations: ['participants'],
    });
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      // JOIN only for filtering — don't select this
      .innerJoin(
        'conversation.participants',
        'filterParticipant',
        'filterParticipant.user.id = :userId',
        { userId },
      )
      // Separate JOIN to load all participants
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .getMany();
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id } })
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return await this.conversationRepository.save({ ...conversation, ...updateConversationDto });
  }

  async remove(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOneBy({ id });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    await this.conversationRepository.delete(id);
    this.logger.log(`Conversation deleted: ${conversation.id}`);
    return conversation;
  }
}
