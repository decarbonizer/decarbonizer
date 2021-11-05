import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { DbObject } from '.';

/**
 * A simple base repository leveraging an underlying Mongoose model.
 * While already useable for some basic use-cases, the class is expected to be
 * extended with methods specific to the model.
 */
export abstract class Repository<T extends DbObject> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Returns all entities within the repository.
   */
  async getAll(): Promise<Array<T>> {
    const docs = await this.model.find();
    return docs.map((doc) => doc.toObject() as unknown as T);
  }

  /**
   * Returns the entity with the given {@link id} or throws a {@link NotFoundException} if no such entity exists.
   * @param id The ID of the entity.
   * @returns The entity with the given ID.
   */
  async getById(id: string): Promise<T> {
    const entity = await this.tryGetById(id);

    if (!entity) {
      throw this.createNotFoundException(id);
    }

    return entity;
  }

  /**
   * Returns the entity with the given {@link id} or a nullish value if no such entity exists.
   * @param id The ID of the entity.
   * @returns The entity with the given ID. A nullish value if no such entity exists.
   */
  async tryGetById(id: string): Promise<T | undefined | null> {
    const doc = await this.model.findById(id);
    return doc?.toObject() as unknown as T;
  }

  /**
   * Adds a new entity to the repository.
   * Inserts an ID if it was not given.
   * @param entity The entity to be added.
   * @returns The newly added entity (with a newly generated ID if it was not given).
   */
  async add(entity: T): Promise<T> {
    const doc = new this.model(entity);
    await doc.save();
    return doc.toObject() as unknown as T;
  }

  /**
   * Updates values of the entity with the given ID and returns the updated entity or throws a {@link NotFoundException}
   * if no entity with the given ID exists.
   * @param id The ID of the entity to be updated.
   * @param entity The values to be updated.
   * @returns The newly updated entity.
   */
  async update(id: string, entity: Partial<T>): Promise<T> {
    const result = await this.tryUpdate(id, entity);

    if (!result) {
      throw this.createNotFoundException(id);
    }

    return result;
  }

  /**
   * Updates values of the entity with the given ID and returns the updated entity or a nullish value
   * if no entity with the given ID exists.
   * @param id The ID of the entity to be updated.
   * @param entity The values to be updated.
   * @returns The newly updated entity or a nullish value if no entity with the given ID exists.
   */
  async tryUpdate(id: string, entity: Partial<T>): Promise<T | undefined | null> {
    if (entity._id && entity._id !== id) {
      throw new BadRequestException(
        `The ${this.model.modelName} entity's ID ${entity._id} conflicts with the given ID ${id}.`,
      );
    }

    const doc = await this.model.findByIdAndUpdate(id, entity as any, { new: true });
    return doc?.toObject() as unknown as T;
  }

  /**
   * Removes the entity with the given ID or throws a {@link NotFoundException} if no such entity exists.
   * @param id The ID of the entity to be removed.
   */
  async removeById(id: string): Promise<void> {
    const couldRemove = await this.tryRemoveById(id);

    if (!couldRemove) {
      throw this.createNotFoundException(id);
    }
  }

  /**
   * Removes the entity with the given ID and returns whether such an entity could be removed.
   * @param id The ID of the entity to be removed.
   * @returns `true` if an entity with the given ID could be removed; `false` if not.
   */
  async tryRemoveById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  private createNotFoundException(id: string) {
    return new NotFoundException(`The ${this.model.modelName} entity with the ID ${id} does not exist.`);
  }
}
