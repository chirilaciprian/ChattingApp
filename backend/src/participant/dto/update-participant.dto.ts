import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateParticipantDto } from './create-participant.dto';
import { IsBoolean, IsDate, IsEAN, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {

    @ApiProperty({
        description: 'Role of the participant',
        example: 'member',
    })
    @IsOptional()
    @IsString()
    @IsIn(['admin', 'member'])
    role?: 'admin' | 'member';

    @ApiProperty({
        description: 'Whether the participant is muted',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isMuted?: boolean;

    @ApiProperty({
        description: 'Last read time of the participant',
        example: '2022-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate()
    lastReadAt?: Date;
}
