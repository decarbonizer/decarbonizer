import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { RealEstateService } from '../real-estate/real-estate.service';
import { BaseDataRepository } from './base-data.repository';
import { BaseData } from './base-data.schema';

@Injectable()
export class BaseDataService extends GenericCrudService<BaseData, BaseData, BaseData, BaseDataRepository> {
  constructor(baseDataRepository: BaseDataRepository, private readonly realEstateService: RealEstateService) {
    super(baseDataRepository);
  }

  async getAllForCurrentCompany() {
    const thisCompanysRealEstates = await this.realEstateService.getAllForCurrentCompany();
    return await Promise.all(thisCompanysRealEstates.map((realEstate) => this.getForRealEstate(realEstate._id!)));
  }

  async getForRealEstate(realEstateId: string): Promise<BaseData> {
    return (
      (await this.repository.tryGetById(realEstateId)) ?? {
        _id: realEstateId,
        realEstateId: realEstateId,
        salaryElectricianMaintenanceWorkerPerHour: 12, // €/h
        timeToChangeOneBulb: 10, // min/Stk
        salaryItMaintenanceWorkerPerHour: 100, // €/h
        reductionFactorByUsingSuperServer: 0.3,
        superServerCost: 2000,
        normalServerCost: 1200,
        serverMaintenanceTime: 6, // h/stk
        serverLifeTime: 8, //years
        footPrintServer: 320, //Co2
        heatingKwHPerQm: 0.1,
        shortTravelEF: 0.15353,
        longTravelEF: 0.19309,
        illuminationEF: 0.624,
      }
    );
  }

  async updateForRealEstate(baseData: BaseData) {
    await this.repository.tryRemoveById(baseData._id ?? baseData.realEstateId ?? '');
    await this.repository.add(baseData);
  }
}
