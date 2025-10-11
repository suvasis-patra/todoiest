import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateTaskDetailsDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
