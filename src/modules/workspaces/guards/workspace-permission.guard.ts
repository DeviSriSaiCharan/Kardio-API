import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { WORKSPACE_ROLES_KEY } from '../decorators/workspace-permission.decorator';
import { WorkspaceRole } from '../enums/workspace-permission.enum';
import { WorkspacesService } from '../workspaces.service';
import { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';

@Injectable()
export class WorkspacePermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspacesService: WorkspacesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(
      WORKSPACE_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Permission() on this route — skip the check
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user.userId;
    const { workspaceId } = request.params as { workspaceId: string };

    const workspace =
      await this.workspacesService.getWorkspaceById(workspaceId);

    if (!workspace) throw new NotFoundException('Workspace not found');

    // Resolve the user's role in this workspace
    const isOwner = workspace.owner.id === userId;
    const isMember = workspace.members.some((m) => m.id === userId);

    const userRole: WorkspaceRole | null = isOwner
      ? WorkspaceRole.OWNER
      : isMember
        ? WorkspaceRole.MEMBER
        : null;

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
