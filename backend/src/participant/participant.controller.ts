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
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Participant')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) { }

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  findAll() {
    return this.participantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.participantService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.participantService.remove(id);
  }
}
