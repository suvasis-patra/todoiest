import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDetailsDto } from './dto/task.dto';
import { TaskService } from './task.service';
import type { Response } from 'express';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  async createTask(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    const creatorId = req.user?.sub as string;
    if (!creatorId) {
      throw new UnauthorizedException('Unauthorized!');
    }
    const task = await this.taskService.createNewTask(creatorId, createTaskDto);
    return task;
  }
  @Get()
  async getTasks(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const creatorId = req.user?.sub as string;
    if (!creatorId) {
      throw new UnauthorizedException('Unauthorized!');
    }
    try {
      const tasks = await this.taskService.getTaskByUser(creatorId);
      if (tasks.length === 0) {
        res.status(HttpStatus.NO_CONTENT);
        return null;
      }
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get tasks!');
    }
  }
  @Get(':taskId')
  async getTask(@Param() { taskId }: { taskId: string }) {
    if (!taskId) {
      throw new BadRequestException('Task Id is required');
    }
    return await this.taskService.getTaskById(taskId);
  }
  @Patch(':taskId')
  async updateTaskDetails(
    @Body() updateTaskDetailsDto: UpdateTaskDetailsDto,
    @Param() { taskId }: { taskId: string },
  ) {
    if (!taskId || Object.keys(updateTaskDetailsDto).length === 0) {
      throw new BadRequestException('Missing task details!');
    }
    return await this.taskService.updateTaskDetails(
      taskId,
      updateTaskDetailsDto,
    );
  }
  @Delete(':taskId')
  async deleteTask(
    @Res({ passthrough: true }) res: Response,
    @Param() { taskId }: { taskId: string },
  ) {
    if (!taskId) throw new BadRequestException('Task id is missing');

    await this.taskService.deleteTask(taskId);
    res.status(HttpStatus.NO_CONTENT);
    return null;
  }
}
