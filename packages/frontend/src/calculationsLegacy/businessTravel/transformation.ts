import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  ReduceAirTravelActionAnswerValue,
  ReduceAirTravelActionDetailsAnswerValue,
} from '../../data/actions/businessTravel/reduceAirTravelAction';
import { BusinessTravelSurveyAnswerValue } from '../../data/surveys/businessTravel/businessTravelSurveyAnswerValue';
import { getActionAnswersForAction } from '../actionAnswers/getActionAnswerForAction';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';

/**
 * Transforms **all given** business travel survey answers so that they integrate the given action answers.
 */
export function transformBusinessTravelSurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const businessTravelSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'businessTravel');
  return businessTravelSurveyAnswers.map((surveyAnswer) =>
    transformBusinessTravelSurveyAnswer(surveyAnswer, actionAnswers),
  );
}

/**
 * Transforms **one** business travel survey answer so that it integrates the given action answers.
 */
export function transformBusinessTravelSurveyAnswer(
  surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): BusinessTravelSurveyAnswerValue {
  let result = surveyAnswer.value;

  const reduceAirTravelActionAnswers = getActionAnswersForAction(actionAnswers, 'reduceAirTravel');
  for (const answer of reduceAirTravelActionAnswers) {
    result = applyReduceAirTravelActionAnswer(surveyAnswer._id, result, answer.values);
  }

  return result;
}

function applyReduceAirTravelActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: BusinessTravelSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<ReduceAirTravelActionAnswerValue, ReduceAirTravelActionDetailsAnswerValue>,
): BusinessTravelSurveyAnswerValue {
  const {
    value: { lessLongTraveling, lessShortTraveling },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    shortTraveling: surveyAnswer.shortTraveling - lessShortTraveling,
    longTraveling: surveyAnswer.longTraveling - lessLongTraveling,
  };
}
