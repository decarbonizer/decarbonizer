import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getActionAnswersForAction } from '../../calculations/actionAnswers/getActionAnswerForAction';
import { ExternalCalculationData } from '../../calculations/externalData';
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
import { assert } from '../../utils/assert';
import { CategoryCoreCalculations, CostDescriptor } from './categoryCoreCalculations';

class IlluminationCoreCalculations extends CategoryCoreCalculations<'illumination'> {
  public constructor() {
    super('illumination');
  }

  public override getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    const { costOnReplace } = this.getMaintenanceCostFactors(externalCalculationData, surveyAnswer);

    return new DataFrame<number, CostDescriptor>([
      {
        cost: costOnReplace,
        displayName: 'Maintenance',
      },
    ]);
  }

  public override getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor> {
    const { costOnReplace, runtimeInHoursPerYearPerBulb, bulbLifetime } = this.getMaintenanceCostFactors(
      externalCalculationData,
      surveyAnswer,
    );
    const totalReplacementsUntilYear = (runtimeInHoursPerYearPerBulb * year) / bulbLifetime;
    const totalReplacementsUntilLastYear = Math.floor((runtimeInHoursPerYearPerBulb * (year - 1)) / bulbLifetime);
    const replacementsCurrentYear = totalReplacementsUntilYear - totalReplacementsUntilLastYear;
    const replacementsThisYear = Math.floor(replacementsCurrentYear);
    const maintenanceCostThisYear = replacementsThisYear * costOnReplace;

    return new DataFrame<number, CostDescriptor>([
      {
        cost: maintenanceCostThisYear,
        displayName: 'Maintenance',
      },
    ]);
  }

  private getMaintenanceCostFactors(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  ) {
    const { bulbs } = externalCalculationData;
    const bulb = bulbs.filter((bulb) => bulb._id === surveyAnswer.value.bulbType).first();
    const avgElectricianWagePerHour = 12.0; // Minimum wage in Germany as of soon. :^)
    const avgElectricianWagePerBulb = avgElectricianWagePerHour / 6; // assume that it takes 10 min to change a bulb
    const runtimeInHoursPerYear = this.getIlluminationRuntimePerYear(surveyAnswer);
    const runtimeInHoursPerYearPerBulb = runtimeInHoursPerYear / surveyAnswer.value.lampCount;
    const costOnReplace =
      surveyAnswer.value.lampCount * bulb.costInEuro + surveyAnswer.value.lampCount * avgElectricianWagePerBulb;

    return {
      costOnReplace,
      runtimeInHoursPerYearPerBulb,
      bulbLifetime: bulb.lifetimeInHours,
    };
  }

  public override getYearlyConstantCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    const { bulbs } = externalCalculationData;
    const bulb = bulbs.filter((bulb) => bulb._id === surveyAnswer.value.bulbType).first();
    const energyForm = { euroPerKwh: 0.25 }; // TODO: Extract from data.
    const runtimeInHoursPerYear = this.getIlluminationRuntimePerYear(surveyAnswer);
    const electricityCosts =
      surveyAnswer.value.lampCount * (bulb.productionKwh * energyForm.euroPerKwh * runtimeInHoursPerYear);

    return new DataFrame<number, CostDescriptor>([
      {
        displayName: 'Electricity',
        cost: electricityCosts,
      },
    ]);
  }

  public override getYearlyFootprintForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  ): number {
    const { bulbs } = externalCalculationData;
    const germanyEF = 0.624;
    const bulb = bulbs.filter((bulb) => bulb._id === surveyAnswer.value.bulbType).first();
    const runtimeInHoursPerYear = this.getIlluminationRuntimePerYear(surveyAnswer);
    return bulb.productionKwh * runtimeInHoursPerYear * germanyEF * surveyAnswer.value.lampCount;
  }

  private getIlluminationRuntimePerYear(
    {
      value: {
        switchOnMode,
        avgRuntimePerDay,
        avgRuntimePerYear = 365,
        motionTriggerTimeout,
        motionTriggerAvgTriggersPerDay,
      },
    }: SurveyAnswer<IlluminationSurveyAnswerValue>,
    fallback = 6,
  ) {
    if (switchOnMode === 'always') {
      // Using avgRuntimePerDay with fallback because it may be set by transformations.
      return (avgRuntimePerDay ?? 24) * avgRuntimePerYear;
    }

    if (switchOnMode === 'manually' || switchOnMode === 'timeTriggered' || switchOnMode === 'brightnessTriggered') {
      assert(avgRuntimePerDay !== undefined);
      assert(avgRuntimePerYear !== undefined);
      return avgRuntimePerDay * avgRuntimePerYear;
    }

    if (switchOnMode === 'motionTriggered') {
      assert(motionTriggerTimeout !== undefined);
      assert(motionTriggerAvgTriggersPerDay !== undefined);
      return motionTriggerTimeout * motionTriggerAvgTriggersPerDay;
    }

    console.warn('Could not determine daily runtime for illumination survey answer. Using fallback value.');
    return fallback;
  }

  public override transformSurveyAnswer(
    _: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): SurveyAnswer<IlluminationSurveyAnswerValue> {
    let result = surveyAnswer.value;

    const changeBulbsActionAnswers = getActionAnswersForAction(actionAnswers, 'changeBulbs');
    for (const answer of changeBulbsActionAnswers) {
      result = this.applyChangeBulbsActionAnswer(surveyAnswer._id, result, answer.values);
    }

    const reduceRuntimeActionAnswers = getActionAnswersForAction(actionAnswers, 'reduceRuntime');
    for (const answer of reduceRuntimeActionAnswers) {
      result = this.applyReduceRuntimeActionAnswer(surveyAnswer._id, result, answer.values);
    }

    return {
      ...surveyAnswer,
      value: result,
    };
  }

  private applyChangeBulbsActionAnswer(
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

  private applyReduceRuntimeActionAnswer(
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
}

export const illuminationCoreCalculations = new IlluminationCoreCalculations();
