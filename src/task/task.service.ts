import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDetailsDto,
  UpdateTaskStatusDto,
} from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async createNewTask(createTaskDto: CreateTaskDto) {
    const { creatorId, description, title } = createTaskDto;
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
    const task = await this.prisma.task.findFirst({ where: { id: taskId } });
    return task;
  }

  async getTaskByUser(creatorId: string) {
    const task = await this.prisma.task.findMany({ where: { creatorId } });
    return task;
  }

  async updateTaskDetails(updateTaskDetailsDto: UpdateTaskDetailsDto) {
    const { id, title, description } = updateTaskDetailsDto;
    await this.prisma.task.update({
      where: { id },
      data: { title, description },
    });
  }

  async updateTaskStatus(updateTaskStatusDto: UpdateTaskStatusDto) {
    const { id, status } = updateTaskStatusDto;
    await this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async deleteTask(tastId: string) {
    await this.prisma.task.delete({ where: { id: tastId } });
  }
}
