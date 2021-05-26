import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMailboxEntities1622013282283 implements MigrationInterface {
    name = 'AddMailboxEntities1622013282283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mailbox_message" ("id" uuid NOT NULL, "content_id" uuid NOT NULL, "content" jsonb NOT NULL, "server_id" text, "message_type" text NOT NULL, "message_source" text NOT NULL, "mailbox_location" text NOT NULL, "sent_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "read_timestamp" TIMESTAMP WITH TIME ZONE, "arrived_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_eb5beb35e00faf3cb0dd9a0e534" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "mailbox_message_location_index" ON "mailbox_message" ("mailbox_location") `);
        await queryRunner.query(`CREATE INDEX "mailbox_message_arrived_index" ON "mailbox_message" ("arrived_timestamp") `);
        await queryRunner.query(`CREATE TABLE "transient_message" ("id" uuid NOT NULL, "content" jsonb NOT NULL, "message_target" text NOT NULL, "message_source" text NOT NULL, "sent_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "arrived_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_68268a269717fec28f58f371243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "transient_message_arrived_index" ON "transient_message" ("arrived_timestamp") `);
        await queryRunner.query(`ALTER TABLE "mailbox_message" ADD CONSTRAINT "FK_ccbb0a60642808eb64049e5ccfe" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mailbox_message" DROP CONSTRAINT "FK_ccbb0a60642808eb64049e5ccfe"`);
        await queryRunner.query(`DROP INDEX "transient_message_arrived_index"`);
        await queryRunner.query(`DROP TABLE "transient_message"`);
        await queryRunner.query(`DROP INDEX "mailbox_message_arrived_index"`);
        await queryRunner.query(`DROP INDEX "mailbox_message_location_index"`);
        await queryRunner.query(`DROP TABLE "mailbox_message"`);
    }

}
