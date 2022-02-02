import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getActionAnswersForAction } from '../getActionAnswersForAction';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  IncreaseDataCenterTemperatureActionAnswerValue,
  IncreaseDataCenterTemperatureActionDetailsAnswerValue,
} from '../../data/actions/it/increaseDataCenterTemperature';
import {
  UseSuperServerActionAnswerValue,
  UseSuperServerActionDetailsAnswerValue,
} from '../../data/actions/it/useSuperServer';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { CategoryCoreCalculations, CostDescriptor } from './categoryCoreCalculations';

export class ItCoreCalculations extends CategoryCoreCalculations<'it'> {
  public constructor() {
    super('it');
  }

  /**
   * Calculates heating produced by the current IT values.
   */
  public getTotalYearlyProducedHeating(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase> = CategoryCoreCalculations.emptyDataFrame,
  ) {
    const surveyAnswersToUse = this.transformSurveyAnswers(
      externalCalculationData,
      surveyAnswers,
      transformingActionAnswers,
    );

    if (!surveyAnswersToUse.any()) {
      return 0;
    }

    return surveyAnswersToUse
      .map((answer) => (answer.value.superServer ? answer.value.dataCenterConsumption * 0.7 : 0))
      .reduce((a, b) => a + b, 0);
  }

  public override getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([
      {
        displayName: 'Replacement cost',
        cost: this.getItReplacementCosts(externalCalculationData, surveyAnswer),
      },
    ]);
  }

  public override getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor> {
    const baseData = this.getRealEstateBaseData(externalCalculationData, surveyAnswer.realEstateId);
    const costOnReplace = this.getItReplacementCosts(externalCalculationData, surveyAnswer);
    const totalReplacementsUntilYear = year / baseData.serverLifeTime;
    const totalReplacementsUntilLastYear = Math.floor((year - 1) / baseData.serverLifeTime);
    const replacementsCurrentYear = totalReplacementsUntilYear - totalReplacementsUntilLastYear;
    const replacementsThisYear = Math.floor(replacementsCurrentYear); //replace servers every 8 years
    const maintenanceCostThisYear = replacementsThisYear * costOnReplace;

    return new DataFrame<number, CostDescriptor>([
      {
        displayName: 'Maintenance cost',
        cost: maintenanceCostThisYear,
      },
    ]);
  }

  private getItReplacementCosts(
    externalCalculationData: ExternalCalculationData,
    answer: SurveyAnswer<ItSurveyAnswerValue>,
  ) {
    const baseData = this.getRealEstateBaseData(externalCalculationData, answer.realEstateId);
    const serverPrice = answer.value.superServer ? baseData.superServerCost : baseData.normalServerCost;
    const avgServerAdminWagePerHour = baseData.salaryItMaintenanceWorkerPerHour;
    const avgServerAdminWagePerServer = avgServerAdminWagePerHour * baseData.serverMaintenanceTime; // assume that it takes 6 hours to install and configure a new server
    //supermicro superserver costs about 200 Euro and normal server (e.g. dell) costs 1200 Euro
    return serverPrice * answer.value.gpuServerCount + answer.value.gpuServerCount * avgServerAdminWagePerServer;
  }

  public override getYearlyConstantCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    const energyForm = externalCalculationData.energyForms
      .filter((energyForm) => energyForm._id === surveyAnswer.value.dataCenterEnergyForm)
      .first();

    const baseData = this.getRealEstateBaseData(externalCalculationData, surveyAnswer.realEstateId);

    const cost = surveyAnswer.value.superServer
      ? energyForm.euroPerKwh * surveyAnswer.value.dataCenterConsumption * baseData.reductionFactorByUsingSuperServer
      : energyForm.euroPerKwh * surveyAnswer.value.dataCenterConsumption;

    return new DataFrame<number, CostDescriptor>([{ displayName: 'Electricity cost', cost }]);
  }

  public override getYearlyFootprintForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
  ): number {
    const baseData = this.getRealEstateBaseData(externalCalculationData, surveyAnswer.realEstateId);
    const energyForm = externalCalculationData.energyForms
      .filter((energyForm) => energyForm._id === surveyAnswer.value.dataCenterEnergyForm)
      .first();

    let energyFootprint = (energyForm.co2PerGramPerKwh / 1000) * surveyAnswer.value.dataCenterConsumption;
    if (surveyAnswer.value.superServer) {
      energyFootprint = energyFootprint * baseData.reductionFactorByUsingSuperServer; // energy consumption is approximately 70% lower
    }

    return baseData.footPrintServer * surveyAnswer.value.gpuServerCount + energyFootprint;
  }

  public override transformSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): SurveyAnswer<ItSurveyAnswerValue> {
    let result = surveyAnswer.value;

    const increaseDataCenterTemperatureActionAnswers = getActionAnswersForAction(
      actionAnswers,
      'increaseDataCenterTemperature',
    );

    const useSuperServerActionAnswers = getActionAnswersForAction(actionAnswers, 'useSuperServer');

    for (const answer of increaseDataCenterTemperatureActionAnswers) {
      result = this.applyIncreaseDataCenterTemperatureActionAnswer(surveyAnswer._id, result, answer.values);
    }

    for (const answer of useSuperServerActionAnswers) {
      result = this.applyUseSuperServerActionAnswer(surveyAnswer._id, result, answer.values);
    }

    return {
      ...surveyAnswer,
      value: result,
    };
  }

  private applyIncreaseDataCenterTemperatureActionAnswer(
    surveyAnswerId: string,
    surveyAnswer: ItSurveyAnswerValue,
    actionAnswer: ActionAnswerValues<
      IncreaseDataCenterTemperatureActionAnswerValue,
      IncreaseDataCenterTemperatureActionDetailsAnswerValue
    >,
  ): ItSurveyAnswerValue {
    const {
      value: { newDataCenterTemperature },
      detailsValue,
    } = actionAnswer;

    if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
      return surveyAnswer;
    }

    const temperatureIncreased = newDataCenterTemperature - surveyAnswer.dataCenterTemperature;
    const newDataCenterConsumption = surveyAnswer.dataCenterConsumption * Math.pow(0.92, temperatureIncreased);

    return {
      ...surveyAnswer,
      dataCenterTemperature: newDataCenterTemperature,
      dataCenterConsumption: newDataCenterConsumption,
    };
  }

  private applyUseSuperServerActionAnswer(
    surveyAnswerId: string,
    surveyAnswer: ItSurveyAnswerValue,
    actionAnswer: ActionAnswerValues<UseSuperServerActionAnswerValue, UseSuperServerActionDetailsAnswerValue>,
  ): ItSurveyAnswerValue {
    const {
      value: { newServer },
      detailsValue,
    } = actionAnswer;

    if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
      return surveyAnswer;
    }

    return {
      ...surveyAnswer,
      dataCenterEnergyForm: '00000000-0000-0000-0000-000000000001', //Water energy form
      superServer: newServer,
    };
  }
}

export const itCoreCalculations = new ItCoreCalculations();
