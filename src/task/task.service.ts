import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateTaskDto, UpdateTaskDetailsDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async createNewTask(creatorId: string, createTaskDto: CreateTaskDto) {
    const { description, title } = createTaskDto;
    try {
      const task = await this.prisma.task.create({
        data: { creatorId, description, title },
      });
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong. Failed to create task!',
      );
    }
  }
  async getTaskById(taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id: taskId } });
      if (!task) {
        throw new NotFoundException(`Task with id ${taskId} is not found!`);
      }
      return task;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const ENTRY_NOT_FOUND = 'P2025';
        if (error.code === ENTRY_NOT_FOUND) {
          throw new NotFoundException(`Task with id ${taskId} not found!`);
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('This is an invalid task ID');
      }
      throw error;
    }
  }

  async getTaskByUser(creatorId: string) {
    const task = await this.prisma.task.findMany({ where: { creatorId } });
    return task;
  }

  async updateTaskDetails(
    taskId: string,
    updateTaskDetailsDto: UpdateTaskDetailsDto,
  ) {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: updateTaskDetailsDto,
      });
      return updatedTask;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const ENTRY_NOT_FOUND = 'P2025';
        if (error.code === ENTRY_NOT_FOUND) {
          throw new NotFoundException(`Task with id ${taskId} not found!`);
        }
      }
      throw new InternalServerErrorException(
        'Failed to update task. Please try again!',
      );
    }
  }

  async deleteTask(taskId: string) {
    try {
      await this.prisma.task.delete({ where: { id: taskId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const ENTRY_NOT_FOUND = 'P2025';
        if (error.code === ENTRY_NOT_FOUND) {
          throw new NotFoundException(`Task with id ${taskId} not found!`);
        }
      }
      throw new InternalServerErrorException(
        'Failed to delete task. Please try again!',
      );
    }
  }
}
