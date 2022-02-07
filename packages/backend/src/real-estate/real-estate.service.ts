import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstate, RealEstateUpdate } from './real-estate.schema';

@Injectable()
export class RealEstateService extends GenericCrudService<
  RealEstate,
  Omit<RealEstate, 'companyId'>,
  RealEstateUpdate,
  RealEstateRepository
> {
  constructor(realEstateRepository: RealEstateRepository, private readonly authService: AuthService) {
    super(realEstateRepository);
  }

  async getAllForCurrentCompany() {
    const companyId = this.authService.getCurrentUserCompanyId();
    return await this.repository.getAll({ companyId }, { cityName: 'asc' });
  }

  protected async mapCreateToEntity(entity: Omit<RealEstate, 'companyId'>): Promise<RealEstate> {
    return { ...entity, companyId: this.authService.getCurrentUserCompanyId() };
  }

  protected async mapUpdateToEntity(entity: RealEstateUpdate): Promise<Partial<RealEstate>> {
    return entity;
  }
}
