import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getActionAnswersForAction } from '../../calculationsLegacy/actionAnswers/getActionAnswerForAction';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';
import { CategoryCoreCalculations, CostDescriptor } from './categoryCoreCalculations';

class ElectricityCoreCalculations extends CategoryCoreCalculations<'electricity'> {
  constructor() {
    super('electricity');
  }

  public override getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getYearlyConstantCostsForSingleSurveyAnswer(
    { energyForms }: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    const energyForm = energyForms.filter((energyForm) => energyForm._id === surveyAnswer.value.energyForm).first();
    const energyCost = energyForm.euroPerKwh * surveyAnswer.value.avgConsumptionPerYear;
    return new DataFrame<number, CostDescriptor>([{ cost: energyCost, displayName: 'Energy cost' }]);
  }

  public override getYearlyFootprintForSingleSurveyAnswer(
    { energyForms }: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
  ): number {
    const energyForm = energyForms.filter((energyForm) => energyForm._id === surveyAnswer.value.energyForm).first();
    return energyForm.co2PerGramPerKwh * surveyAnswer.value.avgConsumptionPerYear;
  }

  public override transformSurveyAnswer(
    _: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<ElectricitySurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): SurveyAnswer<ElectricitySurveyAnswerValue> {
    let result = surveyAnswer.value;

    const switchToGreenEnergyActionAnswers = getActionAnswersForAction(actionAnswers, 'switchToGreenEnergy');
    for (const answer of switchToGreenEnergyActionAnswers) {
      result = this.applySwitchToGreenEnergyActionAnswer(surveyAnswer._id, result, answer.values);
    }

    return {
      ...surveyAnswer,
      value: result,
    };
  }

  private applySwitchToGreenEnergyActionAnswer(
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
}

export const electricityCoreCalculations = new ElectricityCoreCalculations();
