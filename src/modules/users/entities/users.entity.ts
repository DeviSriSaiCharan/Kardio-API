import { Workspace } from '@modules/workspaces/entities/workspace.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * One-to-Many: a User can own many Workspaces.
   * Inverse side of Workspace.owner (@ManyToOne).
   */
  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  ownedWorkspaces: Workspace[];

  /**
   * Many-to-Many: a User can be a member in many Workspaces.
   * Inverse side of Workspace.members (@ManyToMany + @JoinTable).
   */
  @ManyToMany(() => Workspace, (workspace) => workspace.members)
  memberWorkspaces: Workspace[];
}
