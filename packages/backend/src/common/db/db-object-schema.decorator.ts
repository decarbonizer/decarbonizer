import { Schema, SchemaOptions } from '@nestjs/mongoose';
import { DbObject } from './db-object.schema';

/**
 * Configures the default {@link Schema} decorator with properties used for every {@link DbObject}.
 * @param options Additional schema options.
 */
export function DbObjectSchema(options?: SchemaOptions): ClassDecorator {
  return Schema({ timestamps: true, ...options });
}
