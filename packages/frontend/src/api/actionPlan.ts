import { ActionAnswer, ActionAnswerCreate } from './actionAnswer';

export interface ActionPlan {
  name: string;
  startDate: string;
  endDate: string;
  userId: string;
  realEstateId: string;
  actionAnswers: Array<ActionAnswer>;
}

export interface ActionPlanCreate {
  name: string;
  startDate: Date;
  endDate: Date;
  actionAnswers: Array<ActionAnswerCreate>;
}
