import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getActionAnswersForAction } from '../getActionAnswersForAction';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { ActionAnswerValues } from '../../data/actions/action';
import { HeatLessActionAnswerValue, HeatLessActionDetailsAnswerValue } from '../../data/actions/heating/heatLessAction';
import {
  IntegrateSmartRadiatorThermostatsActionAnswerValue,
  IntegrateSmartRadiatorThermostatsActionDetailsAnswerValue,
} from '../../data/actions/heating/integrateSmartRadiatorThermostats';
import {
  SwitchToHeatPumpActionAnswerValue,
  SwitchToHeatPumpActionDetailsAnswerValue,
} from '../../data/actions/heating/switchToHeatPumpAction';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
import { CategoryCoreCalculations, CostDescriptor } from './categoryCoreCalculations';
import { itCoreCalculations } from './itCoreCalculations';

export class HeatingCoreCalculations extends CategoryCoreCalculations<'heating'> {
  public constructor() {
    super('heating');
  }

  public override getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([
      {
        displayName: 'Installation cost',
        cost: this.getHeatingInstallationCostForSingleSurveyAnswer(externalCalculationData, surveyAnswer.value),
      },
    ]);
  }

  public override getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getTotalSummedYearlyConstantCosts(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase> = CategoryCoreCalculations.emptyDataFrame,
    externallyProducedHeatingInKwh: number = itCoreCalculations.getTotalYearlyProducedHeating(
      externalCalculationData,
      surveyAnswers,
      transformingActionAnswers,
    ),
  ): number {
    const surveyAnswersToUse = this.transformSurveyAnswers(
      externalCalculationData,
      surveyAnswers,
      transformingActionAnswers,
    );

    if (!surveyAnswersToUse.any()) {
      return 0;
    }

    let cost = 0;
    let remainingExternallyProducedHeatingInkWh = externallyProducedHeatingInKwh;

    for (const surveyAnswer of surveyAnswersToUse) {
      const originallyRequiredkWh = this.getRequiredkWhForSingleSurveyAnswer(externalCalculationData, surveyAnswer);
      const actualRequiredkWh = originallyRequiredkWh - remainingExternallyProducedHeatingInkWh;
      remainingExternallyProducedHeatingInkWh = Math.max(
        0,
        remainingExternallyProducedHeatingInkWh - originallyRequiredkWh,
      );

      if (actualRequiredkWh > 0) {
        cost += this.getYearlyConstantCostForRequiredHeatingkWh(
          externalCalculationData,
          surveyAnswer,
          actualRequiredkWh,
        );
      }
    }

    return cost;
  }

  public override getYearlyConstantCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    const requiredkWh = this.getRequiredkWhForSingleSurveyAnswer(externalCalculationData, surveyAnswer);
    const energyFormCost = this.getYearlyConstantCostForRequiredHeatingkWh(
      externalCalculationData,
      surveyAnswer,
      requiredkWh,
    );

    return new DataFrame<number, CostDescriptor>([
      {
        displayName: 'Electricity cost',
        cost: energyFormCost,
      },
    ]);
  }

  private getYearlyConstantCostForRequiredHeatingkWh(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
    requiredkWh: number,
  ) {
    const { energyForms } = externalCalculationData;
    const energyForm = energyForms.filter((form) => form._id === surveyAnswer.value.radiatorKind).first();
    const avgHeatingPerYearHours = surveyAnswer.value.avgHeatingPerYear * 8; //assume heating is 8 hours on
    return energyForm.euroPerKwh * requiredkWh * avgHeatingPerYearHours;
  }

  private getHeatingInstallationCostForSingleSurveyAnswer(
    { heatingTypes }: ExternalCalculationData,
    answer: HeatingSurveyAnswerValue,
  ) {
    const heatingType = heatingTypes.filter((heatingType) => heatingType._id === answer.radiatorKind).first();
    const heatingKwhPerQm = 0.1;
    const installationCostInEuro =
      answer.radiatorKind === '00000000-0000-0000-0000-000000000000'
        ? ((heatingKwhPerQm * answer.realEstateAreaInQm * 8) / 4) * heatingType.installationCostInEuro
        : heatingType.installationCostInEuro;
    return installationCostInEuro;
  }

  public override getSummedYearlyFootprint(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer<any>>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase> = CategoryCoreCalculations.emptyDataFrame,
    externallyProducedHeatingInKwh: number = itCoreCalculations.getTotalYearlyProducedHeating(
      externalCalculationData,
      surveyAnswers,
      transformingActionAnswers,
    ),
  ): number {
    const surveyAnswersToUse = this.transformSurveyAnswers(
      externalCalculationData,
      surveyAnswers,
      transformingActionAnswers,
    );

    if (!surveyAnswersToUse.any()) {
      return 0;
    }

    let footprint = 0;
    let remainingExternallyProducedHeatingInkWh = externallyProducedHeatingInKwh;

    for (const surveyAnswer of surveyAnswersToUse) {
      const originallyRequiredkWh = this.getRequiredkWhForSingleSurveyAnswer(externalCalculationData, surveyAnswer);
      const actualRequiredkWh = originallyRequiredkWh - remainingExternallyProducedHeatingInkWh;
      remainingExternallyProducedHeatingInkWh = Math.max(
        0,
        remainingExternallyProducedHeatingInkWh - originallyRequiredkWh,
      );

      if (actualRequiredkWh > 0) {
        footprint += this.getYearlyFootprintForRequiredHeatingkWh(
          externalCalculationData,
          surveyAnswer,
          actualRequiredkWh,
        );
      }
    }

    return footprint;
  }

  public override getYearlyFootprintForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
  ): number {
    const requiredkWh = this.getRequiredkWhForSingleSurveyAnswer(externalCalculationData, surveyAnswer);
    return this.getYearlyFootprintForRequiredHeatingkWh(externalCalculationData, surveyAnswer, requiredkWh);
  }

  private getYearlyFootprintForRequiredHeatingkWh(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
    requiredkWh: number,
  ) {
    const { heatingTypes, energyForms } = externalCalculationData;
    const heatingType = heatingTypes
      .filter((heatingType) => heatingType._id === surveyAnswer.value.radiatorKind)
      .first();
    const energyForm = energyForms.filter((form) => form._id === heatingType._id).first();
    return (energyForm.co2PerGramPerKwh / 1000) * requiredkWh * 8 * surveyAnswer.value.avgHeatingPerYear;
  }

  private getRequiredkWhForSingleSurveyAnswer(
    { heatingTypes }: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
  ) {
    const heatingKwhRequiredPerQm = 0.1;
    const heatingType = heatingTypes
      .filter((heatingType) => heatingType._id === surveyAnswer.value.radiatorKind)
      .first();
    const smartThermostatFactor = surveyAnswer.value.smartThermostats ? 0.9 : 1.0;
    const heatingTypeConsumptionFactor = heatingType.consumptionKwh === 0 ? 1.0 : heatingType.consumptionKwh;

    return (
      (surveyAnswer.value.realEstateAreaInQm *
        heatingKwhRequiredPerQm *
        smartThermostatFactor *
        heatingTypeConsumptionFactor) /
      heatingType.productionKwh
    );
  }

  public override transformSurveyAnswer(
    _: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): SurveyAnswer<HeatingSurveyAnswerValue> {
    let result = surveyAnswer.value;

    const switchToHeatPumpActionAnswers = getActionAnswersForAction(actionAnswers, 'switchToHeatPump');
    for (const answer of switchToHeatPumpActionAnswers) {
      result = this.applySwitchToHeatPumpActionAnswer(surveyAnswer._id, result, answer.values);
    }

    const integrateSmartRadiatorThermostatsActionAnswers = getActionAnswersForAction(
      actionAnswers,
      'integrateSmartRadiatorThermostats',
    );
    for (const answer of integrateSmartRadiatorThermostatsActionAnswers) {
      result = this.applyIntegrateSmartRadiatorThermostatsActionAnswer(surveyAnswer._id, result, answer.values);
    }

    const heatLessActionAnswers = getActionAnswersForAction(actionAnswers, 'heatLess');
    for (const answer of heatLessActionAnswers) {
      result = this.applyHeatLessActionAnswer(surveyAnswer._id, result, answer.values);
    }

    return {
      ...surveyAnswer,
      value: result,
    };
  }

  private applySwitchToHeatPumpActionAnswer(
    surveyAnswerId: string,
    surveyAnswer: HeatingSurveyAnswerValue,
    actionAnswer: ActionAnswerValues<SwitchToHeatPumpActionAnswerValue, SwitchToHeatPumpActionDetailsAnswerValue>,
  ): HeatingSurveyAnswerValue {
    const {
      value: { newHeatPump },
      detailsValue,
    } = actionAnswer;

    if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
      return surveyAnswer;
    }

    return {
      ...surveyAnswer,
      radiatorKind: newHeatPump,
    };
  }

  private applyIntegrateSmartRadiatorThermostatsActionAnswer(
    surveyAnswerId: string,
    surveyAnswer: HeatingSurveyAnswerValue,
    actionAnswer: ActionAnswerValues<
      IntegrateSmartRadiatorThermostatsActionAnswerValue,
      IntegrateSmartRadiatorThermostatsActionDetailsAnswerValue
    >,
  ): HeatingSurveyAnswerValue {
    const {
      value: { newSmartTemperature },
      detailsValue,
    } = actionAnswer;

    if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
      return surveyAnswer;
    }

    return {
      ...surveyAnswer,
      smartThermostats: newSmartTemperature,
    };
  }

  private applyHeatLessActionAnswer(
    surveyAnswerId: string,
    surveyAnswer: HeatingSurveyAnswerValue,
    actionAnswer: ActionAnswerValues<HeatLessActionAnswerValue, HeatLessActionDetailsAnswerValue>,
  ): HeatingSurveyAnswerValue {
    const {
      value: { newRoomTemperature },
      detailsValue,
    } = actionAnswer;

    if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
      return surveyAnswer;
    }

    return {
      ...surveyAnswer,
      roomTemperature: newRoomTemperature,
    };
  }
}

export const heatingCoreCalculations = new HeatingCoreCalculations();
