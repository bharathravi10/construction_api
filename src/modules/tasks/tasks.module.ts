import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../../common/schemas/task.schema';
import { Project, ProjectSchema } from '../../common/schemas/projects.schema';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

