import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1729542000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Core Performance Indexes - Score-based sorting
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_questions_score" ON "questions"("score" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_answers_score" ON "answers"("score" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_questions_created_at" ON "questions"("createdAt" DESC)`,
    );

    // Foreign Key Performance Indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_questions_belongs_to" ON "questions"("belongsToId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_answers_belongs_to" ON "answers"("belongsToId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_answers_question_id" ON "answers"("questionId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_topics_belongs_to" ON "topics"("belongsToId")`,
    );

    // Poll Performance Indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_polls_belongs_to" ON "polls"("belongsToId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_polls_score" ON "polls"("score" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_options_belongs_to" ON "options"("belongsToId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_options_poll_id" ON "options"("pollId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_options_score" ON "options"("score" DESC)`,
    );

    // Search Optimization Indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_topics_follow_count" ON "topics"("followCount" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_users_name_gin" ON "users" USING gin(to_tsvector('english', "name"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_topics_title_gin" ON "topics" USING gin(to_tsvector('english', "title"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all performance indexes in reverse order
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_topics_title_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_name_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_topics_follow_count"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_options_score"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_options_poll_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_options_belongs_to"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_polls_score"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_polls_belongs_to"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_topics_belongs_to"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_answers_question_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_answers_belongs_to"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_questions_belongs_to"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_questions_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_answers_score"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_questions_score"`);
  }
}
