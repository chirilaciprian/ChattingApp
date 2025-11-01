import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The creation timestamp',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The last update timestamp',
  })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
