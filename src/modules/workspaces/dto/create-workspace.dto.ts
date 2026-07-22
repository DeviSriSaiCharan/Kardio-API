import { IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  workspaceColor: string;
}
