import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { getActionAnswersForAction } from '../actionAnswers/getActionAnswerForAction';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformItSurveyAnswer, transformItSurveyAnswers } from './transformation';

export function getInitialItReplacementCost(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const itSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'it');

  const useSuperServerActionAnswers = getActionAnswersForAction(actionAnswers, 'useSuperServer');

  if (useSuperServerActionAnswers.length === 0) {
    return 0;
  } else {
    const replacementCosts = itSurveyAnswers
      .map((originalAnswer) => {
        const transformedAnswer = transformItSurveyAnswer(originalAnswer, actionAnswers);

        return getItReplacementCosts(transformedAnswer);
      })
      .aggregate((a, b) => a + b);

    return replacementCosts;
  }
}

/**
 * Transforms **all given** it survey answers so that they integrate the given action answers
 * and then calculates their resulting cost.
 */
export function getTransformedItMaintenanceCostForYear(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  year: number,
) {
  const transformedAnswers = transformItSurveyAnswers(surveyAnswers, actionAnswers);

  return getItMaintenanceCostForYear(transformedAnswers, year);
}

/**
 * Calculates the cost of **all given** it survey answers.
 */
export function getItMaintenanceCostForYear(surveyAnswers: IDataFrame<number, ItSurveyAnswerValue>, year: number) {
  return surveyAnswers
    .map((answer) => getItMaintenanceCostForYearForSingleSurveyAnswer(answer, year))
    .aggregate((a, b) => ({
      maintenanceCostThisYear: a.maintenanceCostThisYear + b.maintenanceCostThisYear,
      costOnReplace: a.costOnReplace + b.costOnReplace,
    }));
}

function getItMaintenanceCostForYearForSingleSurveyAnswer(answer: ItSurveyAnswerValue, year: number) {
  const costOnReplace = getItReplacementCosts(answer);
  const totalReplacementsUntilYear = year / 8;
  const totalReplacementsUntilLastYear = Math.floor((year - 1) / 8);
  const replacementsCurrentYear = totalReplacementsUntilYear - totalReplacementsUntilLastYear;

  const replacementsThisYear = Math.floor(replacementsCurrentYear); //replace servers every 8 years
  return { maintenanceCostThisYear: replacementsThisYear * costOnReplace, costOnReplace };
}

function getItReplacementCosts(answer: ItSurveyAnswerValue) {
  const serverPrice = answer.superServer ? 2000 : 1200;
  const avgServerAdminWagePerHour = 100.0;
  const avgServerAdminWagePerServer = avgServerAdminWagePerHour * 6; // assume that it takes 6 hours to install and configure a new server
  //supermicro superserver costs about 200 Euro and normal server (e.g. dell) costs 1200 Euro
  return serverPrice * answer.gpuServerCount + answer.gpuServerCount * avgServerAdminWagePerServer;
}
