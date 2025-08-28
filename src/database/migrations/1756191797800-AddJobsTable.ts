import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobsTable1756191797800 implements MigrationInterface {
  name = 'AddJobsTable1756191797800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`jobs\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`location\` varchar(255) NULL, \`salary\` decimal(12,2) NULL, \`skills\` text NULL, \`postImage\` varchar(255) NULL, \`status\` enum ('rejected', 'accepted', 'pending', 'reviewed') NOT NULL DEFAULT 'pending', \`employerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdBy\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedBy\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`jobs\` ADD CONSTRAINT \`FK_62e3afafda3cf7db0a08982a5b1\` FOREIGN KEY (\`employerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`jobs\` DROP FOREIGN KEY \`FK_62e3afafda3cf7db0a08982a5b1\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedBy\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdBy\``);
    await queryRunner.query(`DROP TABLE \`jobs\``);
  }
}
