import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { DeltaResult, getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { illuminationCoreCalculations } from '../core/illuminationCoreCalculations';
import { businessTravelCoreCalculations } from '../core/businessTravelCoreCalculations';
import { heatingCoreCalculations } from '../core/heatingCoreCalculations';
import { itCoreCalculations } from '../core/itCoreCalculations';
import { electricityCoreCalculations } from '../core/electricityCoreCalculations';

export function getGlobalSummedYearlyFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): DeltaResult {
  const before = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers);
  const after = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers, actionAnswers);
  const delta = after - before;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
    before,
    after,
  };
}

/**
 * Transforms **all given** survey answers so that they integrate the given action answers
 * and then calculates the global footprint.
 */
export function getGlobalSummedYearlyFootprint(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers?: IDataFrame<number, ActionAnswerBase>,
) {
  return [
    illuminationCoreCalculations,
    businessTravelCoreCalculations,
    itCoreCalculations,
    heatingCoreCalculations,
    electricityCoreCalculations,
  ]
    .map((coreCalculation) =>
      coreCalculation.getSummedYearlyFootprint(externalCalculationData, surveyAnswers, transformingActionAnswers),
    )
    .reduce((a, b) => a + b, 0);
}

export function getGlobalFootprintForAllRealEstates(externalCalculationData: ExternalCalculationData) {
  const originalFootprintAllRealEstates = externalCalculationData.realEstates
    .map((realEstate) => {
      const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id && surveyAnswer.value.isInitialSurvey,
      );
      const originalFootprintRealEstate = getGlobalSummedYearlyFootprint(
        externalCalculationData,
        surveyAnswersInitital,
        new DataFrame<number, ActionAnswerBase>(),
      );
      return originalFootprintRealEstate;
    })
    .reduce((a, b) => a + b, 0);
  console.log(originalFootprintAllRealEstates);
  const realEstatesAfterActionPlans = externalCalculationData.realEstates.map((realEstate) =>
    externalCalculationData.actionPlans.filter((actionPlan) => actionPlan.realEstateId === realEstate._id),
  );

  const footprintRealEstateActionPlans = realEstatesAfterActionPlans
    .map((actionPlans) => {
      const footPrintDeltaRealEstate = actionPlans
        .map((actionPlan) => {
          const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
            (surveyAnswer) =>
              surveyAnswer.realEstateId === actionPlan.realEstateId && surveyAnswer.value.isInitialSurvey,
          );
          const footprintActionPlan = getGlobalSummedYearlyFootprintDelta(
            externalCalculationData,
            surveyAnswersInitital,
            new DataFrame(actionPlan.actionAnswers),
          ).delta;
          return footprintActionPlan;
        })
        .reduce((a, b) => a + b, 0);
      return footPrintDeltaRealEstate;
    })
    .reduce((a, b) => a + b, 0);

  const globalFootprint = originalFootprintAllRealEstates + footprintRealEstateActionPlans;

  return globalFootprint;
}
