import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { ActionPlanRepository } from './action-plan.repository';
import { ActionPlan, ActionPlanUpdate } from './action-plan.schema';

@Injectable()
export class ActionPlanService extends GenericCrudService<
  ActionPlan,
  Omit<ActionPlan, 'userId'>,
  ActionPlanUpdate,
  ActionPlanRepository
> {
  constructor(actionPlanRepository: ActionPlanRepository, private readonly authService: AuthService) {
    super(actionPlanRepository);
  }

  async getAllForCurrentUser() {
    const userId = this.authService.getCurrentUserId();
    return await this.repository.getAll({ userId }, { startDate: 'asc' });
  }

  async getAllForRealEstate(realEstateId: string) {
    const userId = this.authService.getCurrentUserId();
    return await this.repository.getAll({ userId, realEstateId }, { startDate: 'asc' });
  }

  protected async mapCreateToEntity(entity: Omit<ActionPlan, 'userId'>): Promise<ActionPlan> {
    return { ...entity, userId: this.authService.getCurrentUserId() };
  }

  protected async mapUpdateToEntity(entity: ActionPlanUpdate): Promise<Partial<ActionPlan>> {
    return entity;
  }
}
