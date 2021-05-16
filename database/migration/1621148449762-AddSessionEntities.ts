import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSessionEntities1621148449762 implements MigrationInterface {
    name = 'AddSessionEntities1621148449762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "valid_for" integer NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
