import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6, required: false })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.PROPERTIES_MANAGER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE, required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
