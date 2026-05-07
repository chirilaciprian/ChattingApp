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

  create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    try {
      const participant = this.participantRepository.create(createParticipantDto);
      this.logger.log(`Participant created: ${JSON.stringify(participant)}`);
      return this.participantRepository.save(participant);
    } catch (error) {
      this.logger.error(`Error creating participant: ${error}`);
      throw error;
    }
  }

  findAll(): Promise<Participant[]> {
    return this.participantRepository.find();
  }

  findOne(id: string): Promise<Participant | null> {
    const participant = this.participantRepository.findOne({ where: { id } });
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    return participant;
  }

  update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    const participant = this.participantRepository.findOne({ where: { id } })
    if (!participant) {
      throw new NotFoundException('Participant not found')
    }
    Object.assign(participant, updateParticipantDto)
    const updatedParticipant = this.participantRepository.save(updateParticipantDto);
    this.logger.log(`Participant with id: ${id} updated`)
    return updatedParticipant;
  }

  remove(id: string): Promise<Participant | null> {
    const participant = this.participantRepository.findOne({ where: { id } })
    if (!participant) {
      throw new NotFoundException('Participant not found')
    }
    this.participantRepository.delete(id);
    this.logger.log(`Participant deleted with id : ${id} `)
    return participant;
  }
}
