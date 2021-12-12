import { ActionAnswer, ActionAnswerCreate, ActionAnswerUpdate } from './actionAnswer';
import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';

export type ActionPlanStatus = 'open' | 'inProgress' | 'finished';
export interface ActionPlan extends ApiObject {
  name: string;
  startDate: string;
  endDate: string;
  userId: string;
  realEstateId: string;
  status: ActionPlanStatus;
  actionAnswers: Array<ActionAnswer>;
}

export interface ActionPlanCreate extends ApiObjectCreate {
  name: string;
  startDate: Date;
  endDate: Date;
  status: ActionPlanStatus;
  actionAnswers: Array<ActionAnswerCreate>;
}
export interface ActionPlanUpdate extends ApiObjectUpdate {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ActionPlanStatus;
  actionAnswers?: Array<ActionAnswerUpdate>;
}
