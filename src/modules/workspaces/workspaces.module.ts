import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspace } from './entities/workspace.entity';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { WorkspacePermissionGuard } from './guards/workspace-permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), UsersModule, JwtModule],

  controllers: [WorkspacesController],
  providers: [WorkspacesService, JwtAuthGuard, WorkspacePermissionGuard],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
