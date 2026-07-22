import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/users.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly userService: UsersService,
  ) {}

  async createWorkspace(
    title: string,
    description: string,
    workspaceColor: string,
    userId: string,
  ) {
    const workspace = this.workspaceRepository.create({
      title,
      description,
      workspaceColor,
      owner: { id: userId },
      members: [{ id: userId }],
    });

    return this.workspaceRepository.save(workspace);
  }

  async getWorkspacesByUserId(userId: string) {
    const workspaces = await this.workspaceRepository.find({
      where: [{ owner: { id: userId } }, { members: { id: userId } }],
      relations: {
        owner: true,
        members: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        workspaceColor: true,
        updatedAt: true,
        owner: {
          id: true,
          name: true,
          email: true,
        },
        members: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    return workspaces;
  }

  async getWorkspaceById(workspaceId: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: workspaceId,
      },
      relations: {
        owner: true,
        members: true,
      },
    });

    return workspace;
  }

  async addMemberToWorkspace(workspaceId: string, email: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const isMemberAlready = workspace.members.some(
      (member) => member.email === email,
    );
    if (isMemberAlready) {
      throw new BadRequestException(
        'User is already a member of this workspace',
      );
    }

    const user: User = await this.userService.getUserByEmail(email);

    workspace.members.push(user);

    return this.workspaceRepository.save(workspace);
  }

  async removeMemberFromWorkspace(workspaceId: string, email: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: { members: true, owner: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.owner.email === email) {
      throw new BadRequestException(
        'Cannot remove the owner from the workspace',
      );
    }

    const memberIndex = workspace.members.findIndex((m) => m.email === email);
    if (memberIndex === -1) {
      throw new BadRequestException('User is not a member of this workspace');
    }

    workspace.members.splice(memberIndex, 1);

    return this.workspaceRepository.save(workspace);
  }

  async updateWorkspace(
    workspaceId: string,
    updateDto: Partial<{
      title: string;
      description: string;
      workspaceColor: string;
    }>,
  ) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    Object.assign(workspace, updateDto);

    return this.workspaceRepository.save(workspace);
  }

  async deleteWorkspace(workspaceId: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.workspaceRepository.remove(workspace);

    return { message: 'Workspace deleted successfully' };
  }
}
