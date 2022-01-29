import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getActionAnswersForAction } from '../../calculations/actionAnswers/getActionAnswerForAction';
import { ExternalCalculationData } from '../../calculations/externalData';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  ReduceAirTravelActionAnswerValue,
  ReduceAirTravelActionDetailsAnswerValue,
} from '../../data/actions/businessTravel/reduceAirTravelAction';
import { BusinessTravelSurveyAnswerValue } from '../../data/surveys/businessTravel/businessTravelSurveyAnswerValue';
import { CategoryCoreCalculations, CostDescriptor } from './categoryCoreCalculations';

export class BusinessTravelCoreCalculations extends CategoryCoreCalculations<'businessTravel'> {
  public constructor() {
    super('businessTravel');
  }

  public override getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getYearlyConstantCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor> {
    return new DataFrame<number, CostDescriptor>([]);
  }

  public override getYearlyFootprintForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
  ): number {
    const shortTravelEmissionsPerKm = 0.15353;
    const longTravelEmissionsPerKm = 0.19309;

    return (
      surveyAnswer.value.shortTraveling * shortTravelEmissionsPerKm +
      surveyAnswer.value.longTraveling * longTravelEmissionsPerKm
    );
  }

  public override transformSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<BusinessTravelSurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase<ActionAnswerValues<object, object | undefined>>>,
  ): SurveyAnswer<BusinessTravelSurveyAnswerValue> {
    let result = surveyAnswer.value;

    const reduceAirTravelActionAnswers = getActionAnswersForAction(actionAnswers, 'reduceAirTravel');
    for (const answer of reduceAirTravelActionAnswers) {
      result = this.applyReduceAirTravelActionAnswer(surveyAnswer._id, result, answer.values);
    }

    return { ...surveyAnswer, value: result };
  }

  private applyReduceAirTravelActionAnswer(
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
}

export const businessTravelCoreCalculations = new BusinessTravelCoreCalculations();
