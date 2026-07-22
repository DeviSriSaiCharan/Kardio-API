import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacePermissionGuard } from './guards/workspace-permission.guard';
import { Permission } from './decorators/workspace-permission.decorator';
import { WorkspaceRole } from './enums/workspace-permission.enum';
import type { AuthenticatedRequest } from '@common/types/authenticated-request.type';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async createWorkspace(
    @Req() req: AuthenticatedRequest,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.createWorkspace(
      createWorkspaceDto.title,
      createWorkspaceDto.description,
      createWorkspaceDto.workspaceColor,
      req.user.userId,
    );
  }

  @Get()
  async getWorkspaces(@Req() req: AuthenticatedRequest) {
    console.warn('req.user.userId', req.user.userId);
    return this.workspacesService.getWorkspacesByUserId(req.user.userId);
  }

  @Get(':workspaceId')
  @UseGuards(WorkspacePermissionGuard)
  @Permission([WorkspaceRole.OWNER, WorkspaceRole.MEMBER])
  async getWorkspaceById(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getWorkspaceById(workspaceId);
  }

  /** Owner only */
  @Post(':workspaceId/members')
  @UseGuards(WorkspacePermissionGuard)
  @Permission([WorkspaceRole.OWNER])
  async addMember(
    @Param('workspaceId') workspaceId: string,
    @Body('email') email: string,
  ) {
    return this.workspacesService.addMemberToWorkspace(workspaceId, email);
  }

  @Delete(':workspaceId/members/:userId')
  @UseGuards(WorkspacePermissionGuard)
  @Permission([WorkspaceRole.OWNER])
  async removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('email') email: string,
  ) {
    return this.workspacesService.removeMemberFromWorkspace(workspaceId, email);
  }

  @Patch(':workspaceId')
  @UseGuards(WorkspacePermissionGuard)
  @Permission([WorkspaceRole.OWNER])
  async updateWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() updateDto: Partial<CreateWorkspaceDto>,
  ) {
    return this.workspacesService.updateWorkspace(workspaceId, updateDto);
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspacePermissionGuard)
  @Permission([WorkspaceRole.OWNER])
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.deleteWorkspace(workspaceId);
  }
}
