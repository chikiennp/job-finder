import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1755677225736 implements MigrationInterface {
    name = 'InitSchema1755677225736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`roles\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roles\` \`role\` text NOT NULL`);
    }

}
