import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstate, RealEstateCreate, RealEstateUpdate } from './real-estate.schema';

@Injectable()
export class RealEstateService extends GenericCrudService<
  RealEstate,
  RealEstateCreate,
  RealEstateUpdate,
  RealEstateRepository
> {
  constructor(realEstateRepository: RealEstateRepository) {
    super(realEstateRepository);
  }

  protected async mapCreateToEntity(entity: RealEstateCreate): Promise<RealEstate> {
    return entity;
  }

  protected async mapUpdateToEntity(entity: RealEstateUpdate): Promise<Partial<RealEstate>> {
    return entity;
  }
}
