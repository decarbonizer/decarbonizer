import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { businessTravelCoreCalculations } from '../core/businessTravelCoreCalculations';
import { CategoryCoreCalculations } from '../core/categoryCoreCalculations';
import { KnownCategoryCoreCalculationsId } from '../core/coreCalculations';
import { electricityCoreCalculations } from '../core/electricityCoreCalculations';
import { heatingCoreCalculations } from '../core/heatingCoreCalculations';
import { illuminationCoreCalculations } from '../core/illuminationCoreCalculations';
import { itCoreCalculations } from '../core/itCoreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export interface CalculatedCostsCardRow {
  title: string;
  details: string;
  isNested?: boolean;
  color?: string;
}

export function getCalculatedCostsCardData(
  externalCalculationData: ExternalCalculationData,
  category: KnownCategoryCoreCalculationsId,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionAnswers: Array<ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers);

  switch (category) {
    case 'illumination':
      return getIlluminationRows(externalCalculationData, surveyAnswersDf, transformingActionAnswersDf);
    case 'electricity':
      return getElectricityRows(externalCalculationData, surveyAnswersDf, transformingActionAnswersDf);
    case 'heating':
      return getHeatingRows(externalCalculationData, surveyAnswersDf, transformingActionAnswersDf);
    case 'it':
      return getItRows(externalCalculationData, surveyAnswersDf, transformingActionAnswersDf);
    case 'businessTravel':
      return getBusinessTravelRows(externalCalculationData, surveyAnswersDf, transformingActionAnswersDf);
    default:
      return [];
  }
}

function getIlluminationRows(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  const transformedIlluminationAnswers = illuminationCoreCalculations.transformSurveyAnswers(
    externalCalculationData,
    surveyAnswers,
    transformingActionAnswers,
  );
  const allBulbs = transformedIlluminationAnswers
    .groupBy((answer) => answer.value.bulbType)
    .filter((group) => group.count() > 0)
    .map((group) => ({
      bulb: externalCalculationData.bulbs.filter((bulb) => bulb._id === group.first().value.bulbType).first(),
      count: group.map((answer) => answer.value.lampCount).aggregate((a, b) => a + b),
    }));
  const totalBulbs = allBulbs.map((x) => x.count).sum();

  return [
    {
      title: `${totalBulbs}`,
      details: 'bulbs used',
    },
    ...allBulbs.map((bulb) => ({
      title: `${bulb.count}`,
      details: `${bulb.bulb.name} used`,
      isNested: true,
    })),

    ...getCostAndFootprintRows(
      externalCalculationData,
      illuminationCoreCalculations,
      surveyAnswers,
      transformingActionAnswers,
      'estimated costs per year',
      'Carbon emissions through illumination',
    ),
  ];
}

function getElectricityRows(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  return [
    ...getCostAndFootprintRows(
      externalCalculationData,
      electricityCoreCalculations,
      surveyAnswers,
      transformingActionAnswers,
      'costs produced by electricity',
      'Carbon emissions through electricity',
    ),
  ];
}

function getHeatingRows(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  const producedHeating = itCoreCalculations.getTotalYearlyProducedHeating(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    transformingActionAnswers,
  );

  const footprintDelta = heatingCoreCalculations.getSummedYearlyFootprintDelta(
    externalCalculationData,
    surveyAnswers,
    transformingActionAnswers,
  );

  return [
    ...getCostAndFootprintRows(
      externalCalculationData,
      heatingCoreCalculations,
      surveyAnswers,
      transformingActionAnswers,
      'costs produced by heating',
      'Carbon emissions through heaeting',
    ),

    ...(producedHeating > 0
      ? [
          {
            title: `${producedHeating.toFixed(2)}kWh`,
            details: 'of heating compensated through data centerss',
          },
        ]
      : []),

    ...(footprintDelta.before > 0 && footprintDelta.after === 0
      ? [
          {
            title: `Compensation`,
            details: 'Produced heating by data center completely compensates the carbon footprint.',
            color: '#38A169',
          },
        ]
      : []),
  ];
}

function getItRows(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  const producedHeating = itCoreCalculations.getTotalYearlyProducedHeating(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    transformingActionAnswers,
  );

  return [
    ...getCostAndFootprintRows(
      externalCalculationData,
      itCoreCalculations,
      surveyAnswers,
      transformingActionAnswers,
      'costs produced by data centers',
      'Carbon emissions through data centers',
    ),

    ...(producedHeating > 0
      ? [
          {
            title: `${producedHeating.toFixed(2)}kWh`,
            details: 'of heating produced by super servers',
          },
        ]
      : []),
  ];
}

function getBusinessTravelRows(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
): Array<CalculatedCostsCardRow> {
  return [
    ...getCostAndFootprintRows(
      externalCalculationData,
      businessTravelCoreCalculations,
      surveyAnswers,
      transformingActionAnswers,
      'costs produced by travel',
      'Carbon emissions through travel',
    ),
  ];
}

function getCostAndFootprintRows(
  externalCalculationData: ExternalCalculationData,
  coreCalculations: CategoryCoreCalculations,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
  costDetails: string,
  co2Details: string,
): Array<CalculatedCostsCardRow> {
  const costs = coreCalculations.getTotalSummedYearlyConstantCosts(
    externalCalculationData,
    surveyAnswers,
    transformingActionAnswers,
  );
  const footprint = coreCalculations.getSummedYearlyFootprint(
    externalCalculationData,
    surveyAnswers,
    transformingActionAnswers,
  );

  return [
    {
      title: `${footprint.toFixed()}kg`,
      details: co2Details,
    },
    {
      title: `${costs.toFixed(2)}€`,
      details: costDetails,
    },
  ];
}
