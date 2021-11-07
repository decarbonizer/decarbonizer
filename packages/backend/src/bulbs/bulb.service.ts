import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { BulbRepository } from './bulb.repository';
import { Bulb, BulbUpdate } from './bulb.schema';

@Injectable()
export class BulbService extends GenericCrudService<Bulb, Bulb, BulbUpdate, BulbRepository> {
  constructor(bulbRepository: BulbRepository) {
    super(bulbRepository);
  }

  protected mapCreateToEntity(entity: Bulb): Bulb {
    throw 'Not implemented.';
  }

  protected mapUpdateToEntity(entity: BulbUpdate): Partial<Bulb> {
    throw 'Not implemented.';
  }
}
