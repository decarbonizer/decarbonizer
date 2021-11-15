import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { BulbRepository } from './bulb.repository';
import { Bulb } from './bulb.schema';

@Injectable()
export class BulbService extends GenericCrudService<Bulb, Bulb, Bulb, BulbRepository> {
  constructor(bulbRepository: BulbRepository) {
    super(bulbRepository);
  }

  protected mapCreateToEntity(entity: Bulb): Bulb {
    throw 'Not implemented.';
  }

  protected mapUpdateToEntity(entity: Bulb): Partial<Bulb> {
    throw 'Not implemented.';
  }
}
