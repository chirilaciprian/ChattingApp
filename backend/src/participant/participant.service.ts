import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantService {

  private readonly logger = new Logger(ParticipantService.name);

  constructor(
    @InjectRepository(Participant) private participantRepository: Repository<Participant>
  ) { }

  async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    try {
      const participant = this.participantRepository.create({
        user: { id: createParticipantDto.userId } as any,
        conversation: { id: createParticipantDto.conversationId } as any,
        role: createParticipantDto.role ?? 'member',
      });

      const savedParticipant = await this.participantRepository.save(participant);

      return await this.participantRepository.findOneOrFail({
        where: { id: savedParticipant.id },
        relations: ['user', 'conversation'], // explicitly load relations
      });

    } catch (error) {
      this.logger.error(`Error creating participant: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<Participant[]> {
    return await this.participantRepository.find();
  }

  async findOne(id: string): Promise<Participant | null> {
    const participant = await this.participantRepository.findOne({ where: { id } });
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    return participant;
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    const participant = await this.participantRepository.findOne({ where: { id } })
    if (!participant) {
      throw new NotFoundException('Participant not found')
    }
    Object.assign(participant, updateParticipantDto)
    const updatedParticipant = await this.participantRepository.save(updateParticipantDto);
    this.logger.log(`Participant with id: ${id} updated`)
    return updatedParticipant;
  }

  async remove(id: string): Promise<Participant | null> {
    const participant = await this.participantRepository.findOne({ where: { id } })
    if (!participant) {
      throw new NotFoundException('Participant not found')
    }
    this.participantRepository.delete(id);
    this.logger.log(`Participant deleted with id : ${id} `)
    return participant;
  }

  async incrementUnreadCount(id: string): Promise<Participant> {
    const participant = await this.findOne(id);
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    participant.unreadCount++;
    await this.participantRepository.save(participant);
    this.logger.log(`Participant with id: ${id} unread count incremented`);
    return participant;
  }

  async resetUnreadCount(id: string): Promise<Participant> {
    const participant = await this.findOne(id);
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    participant.unreadCount = 0;
    participant.lastReadAt = new Date();
    await this.participantRepository.save(participant);
    this.logger.log(`Participant with id: ${id} unread count reset`);
    return participant;
  }
}
