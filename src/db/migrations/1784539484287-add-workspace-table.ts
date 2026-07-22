import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaceTable1784539484287 implements MigrationInterface {
  name = 'AddWorkspaceTable1784539484287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspace_members" ("workspace_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_4896b609c71ca5ad20ad662077b" PRIMARY KEY ("workspace_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a7c584ddfe855379598b5e20f" ON "workspace_members"  ("workspace_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e83431119fa585fc7aa8b817d" ON "workspace_members"  ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "workspaces" ADD CONSTRAINT "FK_3bc45ecdd8fdc2108bb92516dde" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_4e83431119fa585fc7aa8b817db" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_4e83431119fa585fc7aa8b817db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspaces" DROP CONSTRAINT "FK_3bc45ecdd8fdc2108bb92516dde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4e83431119fa585fc7aa8b817d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a7c584ddfe855379598b5e20f"`,
    );
    await queryRunner.query(`DROP TABLE "workspace_members"`);
    await queryRunner.query(`DROP TABLE "workspaces"`);
  }
}
