import { SetMetadata } from '@nestjs/common';

export const IS_WORKSPACE_OWNER_KEY = 'isWorkspaceOwner';

/**
 * Apply to any route that must be restricted to the workspace owner.
 * Works together with WorkspaceOwnerGuard, which reads this metadata.
 *
 * The route MUST have a `:workspaceId` route param for the guard to work.
 *
 * @example
 * @Patch(':workspaceId')
 * @UseGuards(JwtAuthGuard, WorkspaceOwnerGuard)
 * @WorkspaceOwner()
 * updateWorkspace(...) {}
 */
export const WorkspaceOwner = () => SetMetadata(IS_WORKSPACE_OWNER_KEY, true);
