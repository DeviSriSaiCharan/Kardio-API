import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_WORKSPACE_OWNER_KEY } from '../decorators/workspace-owner.decorator';
import { WorkspacesService } from '../workspaces.service';
import { AuthenticatedRequest } from '@common/types/authenticated-request.type';

@Injectable()
export class WorkspaceOwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspacesService: WorkspacesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the @WorkspaceOwner() decorator is present on the route
    const isOwnerOnly = this.reflector.getAllAndOverride<boolean>(
      IS_WORKSPACE_OWNER_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If the decorator is absent, the guard is a no-op — let it pass
    if (!isOwnerOnly) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // 2. Pull the authenticated user set by JwtAuthGuard (runs before this)
    const currentUserId = request.user.userId;

    // 3. Pull :workspaceId from the route params
    const workspaceId = request.params['workspaceId'] as string;

    // 4. Load the workspace (owner relation is eagerly fetched inside the service)
    const workspace =
      await this.workspacesService.getWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace not found`);
    }

    // 5. Compare
    if (workspace.owner.id !== currentUserId) {
      throw new ForbiddenException(
        'Only the workspace owner can perform this action',
      );
    }

    return true;
  }
}
