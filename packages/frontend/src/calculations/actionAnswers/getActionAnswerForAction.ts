import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionsToActionAnswerMap, KnownActionId } from '../../data/actions/action';

export function getActionAnswerForAction<TActionId extends KnownActionId>(
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  actionId: TActionId,
): ActionAnswerBase<ActionsToActionAnswerMap[TActionId]> | undefined {
  return actionAnswers.filter((actionAnswer) => actionAnswer.actionId === actionId).at(0) as any;
}
