import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { EnergyFormRepository } from './energy-form.repository';
import { EnergyForm } from './energy-form.schema';

@Injectable()
export class EnergyFormService extends GenericCrudService<EnergyForm, EnergyForm, EnergyForm, EnergyFormRepository> {
  constructor(energyFormRepository: EnergyFormRepository) {
    super(energyFormRepository);
  }

  protected mapCreateToEntity(entity: EnergyForm): EnergyForm {
    throw 'Not implemented.';
  }

  protected mapUpdateToEntity(entity: EnergyForm): Partial<EnergyForm> {
    throw 'Not implemented.';
  }
}
