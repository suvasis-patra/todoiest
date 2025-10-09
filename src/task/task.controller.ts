import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TaskController {
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {}
}
