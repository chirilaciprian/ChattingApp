import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: 'JohnSmith123',
        minLength: 6,
        maxLength: 50,
        description: 'Username of the user',
    })
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(6, { message: 'Username must be at least 6 characters long' })
    @MaxLength(50, { message: 'Username must not exceed 50 characters' })
    username: string;
    @ApiProperty({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL',
    })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @ApiProperty({
        example: true,
        description: 'User online status',
    })
    @IsBoolean()
    isOnline: boolean;

    @IsOptional()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'User last seen',
    })
    @IsDate()
    lastSeen: Date;
}
