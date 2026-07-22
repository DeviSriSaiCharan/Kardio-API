import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaceColorFieldToWorkspaceTable1784655040876 implements MigrationInterface {
  name = 'AddWorkspaceColorFieldToWorkspaceTable1784655040876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspaces" ADD "workspaceColor" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspaces" DROP COLUMN "workspaceColor"`,
    );
  }
}
