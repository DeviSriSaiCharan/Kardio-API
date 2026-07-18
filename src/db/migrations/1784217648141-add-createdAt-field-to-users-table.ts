import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtFieldToUsersTable1784217648141 implements MigrationInterface {
  name = 'AddCreatedAtFieldToUsersTable1784217648141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
  }
}
