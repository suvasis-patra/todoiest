import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  creatorId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateTaskDetailsDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateTaskStatusDto {
  @IsString()
  id: string;

  @IsEnum(Status)
  status: Status;
}
