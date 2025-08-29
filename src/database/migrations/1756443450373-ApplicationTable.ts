import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplicationTable1756443450373 implements MigrationInterface {
    name = 'ApplicationTable1756443450373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`application\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('rejected', 'accepted', 'pending', 'reviewed') NOT NULL DEFAULT 'pending', \`resumeUrl\` varchar(255) NULL, \`coverLetter\` varchar(255) NULL, \`appliedById\` int NULL, \`jobId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastLogin\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_d7a2addda18655a5f2b413d8e90\` FOREIGN KEY (\`appliedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_dbc0341504212f830211b69ba0c\` FOREIGN KEY (\`jobId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_dbc0341504212f830211b69ba0c\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_d7a2addda18655a5f2b413d8e90\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastLogin\``);
        await queryRunner.query(`DROP TABLE \`application\``);
    }

}
