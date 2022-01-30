import { SurveyAnswer } from '../../api/surveyAnswer';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';
import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { getActionAnswersForAction } from '../../calculations/utils';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';

export function transformElectricitySurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const electricitySurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'electricity');
  return electricitySurveyAnswers.map((surveyAnswer) => transformElectricitySurveyAnswer(surveyAnswer, actionAnswers));
}

export function transformElectricitySurveyAnswer(
  surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): ElectricitySurveyAnswerValue {
  let result = surveyAnswer.value;

  const switchToGreenEnergyActionAnswers = getActionAnswersForAction(actionAnswers, 'switchToGreenEnergy');
  for (const answer of switchToGreenEnergyActionAnswers) {
    result = applySwitchToGreenEnergyActionAnswer(surveyAnswer._id, result, answer.values);
  }

  return result;
}

function applySwitchToGreenEnergyActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: ElectricitySurveyAnswerValue,
  actionAnswer: ActionAnswerValues<SwitchToGreenEnergyActionAnswerValue, SwitchToGreenEnergyDetailsAnswerValue>,
): ElectricitySurveyAnswerValue {
  const {
    value: { newEnergyForm },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    energyForm: newEnergyForm,
  };
}
