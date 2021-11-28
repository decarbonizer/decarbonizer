import { Logger } from '@nestjs/common';
import { DbObject } from '../db/db-object.schema';
import { Repository } from '../db/repository';

/**
 * An abstract base class for a generic CRUD service for a normal non-nested entity.
 * Implements the boilerplate code and repository interaction.
 *
 * You should inherit from this class and enhance it with additional methods as required.
 */
export abstract class GenericCrudService<
  TEntity extends DbObject,
  TCreate,
  TUpdate,
  TRepository extends Repository<TEntity>,
> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly repository: TRepository) {}

  async getAll() {
    const result = await this.repository.getAll();
    this.logger.debug(`[getAll] Returned ${result.length} entities.`);
    return result;
  }

  async get(id: string) {
    const result = await this.repository.getById(id);
    this.logger.debug(`[get] Returned the entity with the ID ${id}.`);
    return result;
  }

  async create(entity: TCreate) {
    const result = await this.repository.add(await this.mapCreateToEntity(entity));
    this.logger.log(`[create] Successfully created a new entity with the ID ${result._id}.`);
    return result;
  }

  async update(id: string, entity: TUpdate) {
    const result = await this.repository.update(id, await this.mapUpdateToEntity(entity));
    this.logger.log(`[update] Successfully updated the entity with the ID ${result._id}.`);
    return result;
  }

  async delete(id: string) {
    await this.repository.removeById(id);
    this.logger.log(`[delete] Successfully deleted the entity with the ID ${id}.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async mapCreateToEntity(entity: TCreate): Promise<TEntity> {
    throw 'Not implemented.';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async mapUpdateToEntity(entity: TUpdate): Promise<Partial<TEntity>> {
    throw 'Not implemented.';
  }
}
