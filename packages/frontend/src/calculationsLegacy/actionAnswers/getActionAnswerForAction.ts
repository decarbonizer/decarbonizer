import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionsToActionAnswerMap, KnownActionId } from '../../data/actions/action';

export function getActionAnswersForAction<TActionId extends KnownActionId>(
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  actionId: TActionId,
): Array<ActionAnswerBase<ActionsToActionAnswerMap[TActionId]>> {
  return actionAnswers.filter((actionAnswer) => actionAnswer.actionId === actionId).toArray() as any;
}
