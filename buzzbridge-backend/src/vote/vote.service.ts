import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { User } from '../entity/user.entity';

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

export enum VoteAction {
  ADD = 'add',
  REMOVE = 'remove',
}

export interface VoteResult {
  success: boolean;
  newScore: number;
  message?: string;
}

@Injectable()
export class VoteService {
  private readonly logger = new Logger(VoteService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Generic voting method that works for both Questions and Answers
   * Uses a single transaction to ensure data consistency and better performance
   */
  async handleVote(
    entityType: 'question' | 'answer',
    entityId: number,
    user: User,
    voteType: VoteType,
    action: VoteAction,
  ): Promise<VoteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.processVote(
        queryRunner,
        entityType,
        entityId,
        user.id,
        voteType,
        action,
      );

      await queryRunner.commitTransaction();
      this.logger.log(
        `${action} ${voteType} for ${entityType} ${entityId} by user ${user.id}`,
      );
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Vote operation failed: ${error.message}`);
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async processVote(
    queryRunner: QueryRunner,
    entityType: 'question' | 'answer',
    entityId: number,
    userId: number,
    voteType: VoteType,
    action: VoteAction,
  ): Promise<VoteResult> {
    // Define table names based on entity type
    const entityTable = entityType === 'question' ? 'questions' : 'answers';
    const upvoteTable =
      entityType === 'question'
        ? 'questions_upvoted_by_users'
        : 'answers_upvoted_by_users';
    const downvoteTable =
      entityType === 'question'
        ? 'questions_downvoted_by_users'
        : 'answers_downvoted_by_users';
    const entityColumn =
      entityType === 'question' ? 'questionsId' : 'answersId';

    // Get current vote state and score in a single query
    const currentState = await queryRunner.query(
      `
      SELECT 
        e.score,
        CASE WHEN up_votes."${entityColumn}" IS NOT NULL THEN true ELSE false END as has_upvote,
        CASE WHEN down_votes."${entityColumn}" IS NOT NULL THEN true ELSE false END as has_downvote
      FROM ${entityTable} e
      LEFT JOIN ${upvoteTable} up_votes ON up_votes."${entityColumn}" = e.id AND up_votes."usersId" = $1
      LEFT JOIN ${downvoteTable} down_votes ON down_votes."${entityColumn}" = e.id AND down_votes."usersId" = $1
      WHERE e.id = $2
      `,
      [userId, entityId],
    );

    if (!currentState || currentState.length === 0) {
      throw new Error(`${entityType} not found`);
    }

    const { score, has_upvote, has_downvote } = currentState[0];
    let newScore = score;
    const operations: string[] = [];

    // Determine what operations to perform
    if (action === VoteAction.ADD) {
      if (voteType === VoteType.UPVOTE) {
        if (has_upvote) {
          throw new Error(`Already upvoted this ${entityType}`);
        }
        // Add upvote
        operations.push(`
          INSERT INTO ${upvoteTable} ("${entityColumn}", "usersId") 
          VALUES (${entityId}, ${userId})
        `);
        newScore += 1;

        // Remove downvote if exists
        if (has_downvote) {
          operations.push(`
            DELETE FROM ${downvoteTable} 
            WHERE "${entityColumn}" = ${entityId} AND "usersId" = ${userId}
          `);
          newScore += 1; // Additional +1 for removing downvote
        }
      } else {
        // DOWNVOTE
        if (has_downvote) {
          throw new Error(`Already downvoted this ${entityType}`);
        }
        // Add downvote
        operations.push(`
          INSERT INTO ${downvoteTable} ("${entityColumn}", "usersId") 
          VALUES (${entityId}, ${userId})
        `);
        newScore -= 1;

        // Remove upvote if exists
        if (has_upvote) {
          operations.push(`
            DELETE FROM ${upvoteTable} 
            WHERE "${entityColumn}" = ${entityId} AND "usersId" = ${userId}
          `);
          newScore -= 1; // Additional -1 for removing upvote
        }
      }
    } else {
      // REMOVE action
      if (voteType === VoteType.UPVOTE) {
        if (!has_upvote) {
          throw new Error('Cannot remove upvote');
        }
        operations.push(`
          DELETE FROM ${upvoteTable} 
          WHERE "${entityColumn}" = ${entityId} AND "usersId" = ${userId}
        `);
        newScore -= 1;
      } else {
        // REMOVE DOWNVOTE
        if (!has_downvote) {
          throw new Error('Cannot remove downvote');
        }
        operations.push(`
          DELETE FROM ${downvoteTable} 
          WHERE "${entityColumn}" = ${entityId} AND "usersId" = ${userId}
        `);
        newScore += 1;
      }
    }

    // Execute all vote operations
    for (const operation of operations) {
      await queryRunner.query(operation);
    }

    // Update score
    await queryRunner.query(
      `UPDATE ${entityTable} SET score = $1 WHERE id = $2`,
      [newScore, entityId],
    );

    return {
      success: true,
      newScore,
    };
  }

  /**
   * Convenience methods for common vote operations
   */
  async upvote(
    entityType: 'question' | 'answer',
    entityId: number,
    user: User,
  ): Promise<VoteResult> {
    return this.handleVote(
      entityType,
      entityId,
      user,
      VoteType.UPVOTE,
      VoteAction.ADD,
    );
  }

  async downvote(
    entityType: 'question' | 'answer',
    entityId: number,
    user: User,
  ): Promise<VoteResult> {
    return this.handleVote(
      entityType,
      entityId,
      user,
      VoteType.DOWNVOTE,
      VoteAction.ADD,
    );
  }

  async removeUpvote(
    entityType: 'question' | 'answer',
    entityId: number,
    user: User,
  ): Promise<VoteResult> {
    return this.handleVote(
      entityType,
      entityId,
      user,
      VoteType.UPVOTE,
      VoteAction.REMOVE,
    );
  }

  async removeDownvote(
    entityType: 'question' | 'answer',
    entityId: number,
    user: User,
  ): Promise<VoteResult> {
    return this.handleVote(
      entityType,
      entityId,
      user,
      VoteType.DOWNVOTE,
      VoteAction.REMOVE,
    );
  }
}
