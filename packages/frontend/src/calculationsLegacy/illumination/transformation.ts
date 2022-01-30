import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  ChangeBulbsActionAnswerValue,
  ChangeBulbsActionDetailsAnswerValue,
} from '../../data/actions/illumination/changeBulbsAction';
import {
  ReduceRuntimeActionAnswerValue,
  ReduceRuntimeActionDetailsAnswerValue,
} from '../../data/actions/illumination/reduceRuntimeAction';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { getActionAnswersForAction } from '../../calculations/utils';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';

/**
 * Transforms **all given** illumination survey answers so that they integrate the given action answers.
 */
export function transformIlluminationSurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const illuminationSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'illumination');
  return illuminationSurveyAnswers.map((surveyAnswer) =>
    transformIlluminationSurveyAnswer(surveyAnswer, actionAnswers),
  );
}

/**
 * Transforms **one** illumination survey answer so that it integrates the given action answers.
 */
export function transformIlluminationSurveyAnswer(
  surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): IlluminationSurveyAnswerValue {
  let result = surveyAnswer.value;

  const changeBulbsActionAnswers = getActionAnswersForAction(actionAnswers, 'changeBulbs');
  for (const answer of changeBulbsActionAnswers) {
    result = applyChangeBulbsActionAnswer(surveyAnswer._id, result, answer.values);
  }

  const reduceRuntimeActionAnswers = getActionAnswersForAction(actionAnswers, 'reduceRuntime');
  for (const answer of reduceRuntimeActionAnswers) {
    result = applyReduceRuntimeActionAnswer(surveyAnswer._id, result, answer.values);
  }

  return result;
}

function applyChangeBulbsActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: IlluminationSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue>,
): IlluminationSurveyAnswerValue {
  const {
    value: { newBulb },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    bulbType: newBulb,
  };
}

function applyReduceRuntimeActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: IlluminationSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<ReduceRuntimeActionAnswerValue, ReduceRuntimeActionDetailsAnswerValue>,
): IlluminationSurveyAnswerValue {
  const {
    value: { dailyRuntimeReductionInDays, yearlyRuntimeReductionInDays },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  const overrides: Partial<IlluminationSurveyAnswerValue> = {};

  if (dailyRuntimeReductionInDays && (surveyAnswer.avgRuntimePerDay || surveyAnswer.switchOnMode === 'always')) {
    const initialAvgRuntimePerDay = surveyAnswer.avgRuntimePerDay ?? 1;
    overrides.avgRuntimePerDay = Math.max(0, initialAvgRuntimePerDay - dailyRuntimeReductionInDays);
  }

  if (yearlyRuntimeReductionInDays) {
    const initialAvgRuntimePerYear = surveyAnswer.avgRuntimePerYear ?? 365;
    overrides.avgRuntimePerYear = Math.max(0, initialAvgRuntimePerYear - yearlyRuntimeReductionInDays);
  }

  return {
    ...surveyAnswer,
    ...overrides,
  };
}
