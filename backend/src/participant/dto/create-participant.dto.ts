import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateParticipantDto {
    @ApiProperty({
        description: 'UUID of the user',
        example: 'a5e1f1ee-6c54-4b01-90e6-d701748f0852',
    })
    @IsUUID()
    userId: string

    @ApiProperty({
        description: 'UUID of the conversation',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsUUID()
    conversationId: string

    @ApiProperty({
        description: 'Role of the participant',
        example: 'admin',
    })
    @IsString()
    @IsIn(['admin', 'member'])
    role: 'admin' | 'member';

}
