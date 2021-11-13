import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstate, RealEstateUpdate } from './real-estate.schema';

@Injectable()
export class RealEstateService extends GenericCrudService<
  RealEstate,
  RealEstate,
  RealEstateUpdate,
  RealEstateRepository
> {
  constructor(realEstateRepository: RealEstateRepository) {
    super(realEstateRepository);
  }

  protected mapCreateToEntity(entity: RealEstate): RealEstate {
    return entity;
  }

  protected mapUpdateToEntity(entity: RealEstateUpdate): Partial<RealEstate> {
    throw 'Not implemented.';
  }
}
