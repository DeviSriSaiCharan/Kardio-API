import { SetMetadata } from '@nestjs/common';
import { WorkspaceRole } from '../enums/workspace-permission.enum';

export const WORKSPACE_ROLES_KEY = 'workspaceRoles';

/**
 * Restricts a route to users who hold one of the given roles in the workspace.
 * The route must have a `:workspaceId` param.
 *
 * @example
 * @Permission([WorkspaceRole.OWNER])           // owner only
 * @Permission([WorkspaceRole.OWNER, WorkspaceRole.MEMBER])  // any member
 */
export const Permission = (roles: WorkspaceRole[]) =>
  SetMetadata(WORKSPACE_ROLES_KEY, roles);
