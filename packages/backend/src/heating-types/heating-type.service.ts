import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { HeatingTypeRepository } from './heating-type.repository';
import { HeatingType } from './heating-type.schema';

@Injectable()
export class HeatingTypeService extends GenericCrudService<
  HeatingType,
  HeatingType,
  HeatingType,
  HeatingTypeRepository
> {
  constructor(heatingTypeRepository: HeatingTypeRepository) {
    super(heatingTypeRepository);
  }
}
