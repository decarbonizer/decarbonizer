import { ApiObject, ApiObjectCreate } from './apiObject';
import { KnownActionId, ActionsToActionAnswerMap, ActionAnswerValues } from '../data/actions/action';

export interface ActionAnswerBase<T extends ActionAnswerValues = ActionAnswerValues> {
  actionId: KnownActionId;
  values: T;
}

export interface ActionAnswer<T extends ActionAnswerValues> extends ApiObject, ActionAnswerBase<T> {}

export interface ActionAnswerCreate<T extends ActionAnswerValues> extends ApiObjectCreate, ActionAnswerBase<T> {}

/**
 * Evaluates whether the given survey answer relates to a known survey.
 * @param actionId The type of survey to check for.
 * @param answer The survey answer.
 * @returns `true` if the survey answer's value has the shape of the known survey; `false` if not.
 */
export function isActionAnswerType<ActionId extends KnownActionId>(
  actionId: KnownActionId,
  answer: ActionAnswerBase,
): answer is ActionAnswerBase<ActionsToActionAnswerMap[ActionId]> {
  return answer.actionId === actionId;
}
