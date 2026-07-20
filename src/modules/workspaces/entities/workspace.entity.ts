import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/users/entities/users.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  /**
   * One-to-Many: one User (owner) can own many Workspaces.
   * This is the "many" side — each workspace has exactly one owner.
   */
  @ManyToOne(() => User, (user) => user.ownedWorkspaces, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  /**
   * Many-to-Many: a Workspace can have many member Users,
   * and a User can be a member in many Workspaces.
   * @JoinTable lives on the owning side (Workspace) and creates
   * the `workspace_members_users` join table.
   */
  @ManyToMany(() => User, (user) => user.memberWorkspaces)
  @JoinTable({
    name: 'workspace_members',
    joinColumn: { name: 'workspace_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
