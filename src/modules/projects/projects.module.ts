import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../../common/schemas/projects.schema';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
