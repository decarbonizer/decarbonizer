import { Logger } from '@nestjs/common';
import { DbObject } from '../common/db/db-object.schema';
import { Repository } from '../common/db/repository';

export interface DbSeeder {
  drop(): Promise<void>;

  seed(): Promise<void>;
}

export abstract class DefaultDbSeeder<T extends DbObject> implements DbSeeder {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly repository: Repository<T>) {}

  async drop() {
    this.logger.log('Removing all entities...');

    try {
      const removed = await this.repository.removeAll();
      this.logger.log(`Successfully removed ${removed} entities.`);
    } catch (e) {
      this.logger.error('Removing all entities failed due to an unexpected error.', e);
    }
  }

  async seed() {
    const seed = this.getSeed();
    this.logger.log('Seeding entities...');

    let succeeded = 0;
    let failed = 0;

    await Promise.all(
      seed.map(async (entity) => {
        try {
          await this.repository.add(entity);
          succeeded++;
          this.logger.debug('Successfully seeded the following entity.', entity);
        } catch (e) {
          failed++;
          this.logger.error('Seeding the following entity failed due to an unexpected error.', entity, e);
        }
      }),
    );

    this.logger.log(`Seeding finished. ${succeeded} entities were successfully seeded. ${failed} failed.`);
  }

  protected abstract getSeed(): Array<T>;
}
