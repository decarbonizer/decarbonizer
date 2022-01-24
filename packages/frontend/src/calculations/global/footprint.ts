import { DataFrame, IDataFrame } from 'data-forge';
import range from 'lodash-es/range';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getTransformedHeatingFootprintPerYear } from '../heating/footprint';
import { getTransformedIlluminationFootprintPerYear } from '../illumination/footprint';
import { getTransformedElectricityFootprintPerYear } from '../electricity/footprint';
import { getTransformedBusinessTravelFootprintPerYear } from '../businessTravel/footprint';
import { getTransformedItFootprintPerYear } from '../it/footprint';
import { ActionPlan } from '../../api/actionPlan';
import { ChooseTimePeriodElementAnswerValue } from '../../data/actions/shared/chooseTimePeriodElement';

export function getFootprintForYearRange(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionPlans: IDataFrame<number, ActionPlan>,
  fromYear: number,
  toYear: number,
) {
  const startFootprint = getTransformedFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    new DataFrame<number, ActionAnswerBase>(),
  ).globalFootprint;

  const linearizedActionAnswers = actionPlans
    .flatMap((actionPlan) =>
      actionPlan.actionAnswers.map((answer) => {
        const detailsValue = (answer.values.detailsValue ?? {}) as ChooseTimePeriodElementAnswerValue;
        const startDate = new Date(detailsValue.timePeriod?.startDate ?? actionPlan.startDate);
        const endDate = new Date(detailsValue.timePeriod?.endDate ?? actionPlan.endDate);

        return {
          answer,
          startDate,
          endDate,
        };
      }),
    )
    .orderBy((x) => x.endDate)
    .thenBy((x) => x.startDate);

  return range(fromYear, toYear + 1).map((year) => {
    const activeActionAnswers = linearizedActionAnswers
      .where((x) => x.endDate.getFullYear() <= year)
      .map((x) => x.answer);

    const footprint = getTransformedFootprintPerYear(
      externalCalculationData,
      surveyAnswers,
      new DataFrame(activeActionAnswers),
    ).globalFootprint;

    return {
      year,
      footprint: Math.round(footprint),
      startFootprint: Math.round(startFootprint),
    };
  });
}

export function getFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const originalFootprint = getTransformedFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    new DataFrame<number, ActionAnswerBase>(),
  ).globalFootprint;

  const footprintAfterActions = getTransformedFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  ).globalFootprint;

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
    originalFootprint,
    footprintAfterActions,
  };
}

/**
 * Transforms **all given** survey answers so that they integrate the given action answers
 * and then calculates the global footprint.
 */
export function getTransformedFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const electricityFootprint = getTransformedElectricityFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );
  const illuminationFootprint = getTransformedIlluminationFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );

  const heatingFootprint = getTransformedHeatingFootprintPerYear(externalCalculationData, surveyAnswers, actionAnswers);
  const itFootprint = getTransformedItFootprintPerYear(externalCalculationData, surveyAnswers, actionAnswers);
  const businessTravelFootprint = getTransformedBusinessTravelFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );

  // TODO: Sum other footprints that are added in the future.
  const globalFootprint =
    illuminationFootprint + heatingFootprint + electricityFootprint + itFootprint + businessTravelFootprint;

  return {
    globalFootprint,
    electricityFootprint,
    illuminationFootprint,
    heatingFootprint,
  };
}
