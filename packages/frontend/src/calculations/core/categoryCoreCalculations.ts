import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { isSurveyAnswerType, SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { KnownSurveyId, SurveyToSurveyAnswerMap } from '../../data/surveys/survey';
import { DeltaResult, getDeltaType } from '../../utils/deltaType';
import isEqual from 'lodash-es/isEqual';

export interface CostDescriptor {
  displayName: string;
  cost: number;
}

export abstract class CategoryCoreCalculations<
  TSurveyId extends KnownSurveyId = KnownSurveyId,
  TSurveyAnswerValue extends SurveyToSurveyAnswerMap[TSurveyId] = SurveyToSurveyAnswerMap[TSurveyId],
> {
  protected static emptyDataFrame = new DataFrame();

  protected constructor(protected surveyId: TSurveyId) {}

  //
  // Investment Costs.
  //

  public getTotalSummedInvestmentCosts(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase> = CategoryCoreCalculations.emptyDataFrame,
  ) {
    return this.filterThisCategorysSurveyAnswers(surveyAnswers)
      .flatMap((surveyAnswer) => {
        const transformedSurveyAnswer = this.transformSurveyAnswer(
          externalCalculationData,
          surveyAnswer,
          transformingActionAnswers,
        );
        const isInvestmentRequired = this.isInitialInvestmentRequiredForSingleSurveyAnswer(
          externalCalculationData,
          surveyAnswer,
          transformedSurveyAnswer,
        );

        if (isInvestmentRequired) {
          return this.getInvestmentCostsForSingleSurveyAnswer(externalCalculationData, transformedSurveyAnswer);
        } else {
          return [];
        }
      })
      .reduce((result, cost) => result + cost.cost, 0);
  }

  /**
   * Gets the initial investment cost required by the given survey answer.
   * Investment costs only occur once when the given installation/data is implemented.
   * An example is the purchase of new hardware.
   */
  public abstract getInvestmentCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor>;

  protected isInitialInvestmentRequiredForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
    transformedSurveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
  ): boolean {
    return !isEqual(surveyAnswer.value, transformedSurveyAnswer.value);
  }

  //
  // Yearly Changing Costs.
  //

  public getTotalSummedYearlyChangingCostsDelta(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
    year: number,
  ) {
    return this.getDeltaResult(
      this.getTotalSummedYearlyChangingCosts(externalCalculationData, surveyAnswers, undefined, year),
      this.getTotalSummedYearlyChangingCosts(externalCalculationData, surveyAnswers, transformingActionAnswers, year),
    );
  }

  public getTotalSummedYearlyChangingCosts(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase> = CategoryCoreCalculations.emptyDataFrame,
    year: number,
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
      .flatMap((surveyAnswer) =>
        this.getYearlyChangingCostsForSingleSurveyAnswer(externalCalculationData, surveyAnswer, year),
      )
      .reduce((result, cost) => result + cost.cost, 0);
  }

  /**
   * Gets yearly changing costs created by the given survey answer.
   * Changing costs are *not* constant and change every year. An example is the maintenance
   * of bulbs which is only required every n years depending on the bulb's usage.
   */
  public abstract getYearlyChangingCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
    year: number,
  ): IDataFrame<number, CostDescriptor>;

  //
  // Yearly Constant Costs.
  //

  /**
   * Returns the delta between all total constant costs occuring in a single year before and after
   * applying the transforming action answers.
   */
  public getTotalSummedYearlyConstantCostsDelta(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
  ) {
    return this.getDeltaResult(
      this.getTotalSummedYearlyConstantCosts(externalCalculationData, surveyAnswers),
      this.getTotalSummedYearlyConstantCosts(externalCalculationData, surveyAnswers, transformingActionAnswers),
    );
  }

  /**
   * Returns the sum of all total constant costs occuring in a single year.
   */
  public getTotalSummedYearlyConstantCosts(
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
      .flatMap((surveyAnswer) =>
        this.getYearlyConstantCostsForSingleSurveyAnswer(externalCalculationData, surveyAnswer),
      )
      .reduce((result, cost) => result + cost.cost, 0);
  }

  /**
   * Gets the constant costs created by the given survey answer.
   * Constant costs are constant and occur every year. An example is the average electricity cost
   * generated by the same room every year.
   */
  public abstract getYearlyConstantCostsForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
  ): IDataFrame<number, CostDescriptor>;

  //
  // Footprint Calculation.
  //

  public getSummedYearlyFootprintDelta(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    transformingActionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): DeltaResult {
    return this.getDeltaResult(
      this.getSummedYearlyFootprint(externalCalculationData, surveyAnswers),
      this.getSummedYearlyFootprint(externalCalculationData, surveyAnswers, transformingActionAnswers),
    );
  }

  public getSummedYearlyFootprint(
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
      .map((surveyAnswer) => this.getYearlyFootprintForSingleSurveyAnswer(externalCalculationData, surveyAnswer))
      .reduce((result, footprint) => result + footprint, 0);
  }

  /**
   * Calculates the yearly footprint produced by the given survey answer (in kg per year).
   */
  public abstract getYearlyFootprintForSingleSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
  ): number;

  //
  // Survey Answer Transformation.
  //

  public transformSurveyAnswers(
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): IDataFrame<number, SurveyAnswer<TSurveyAnswerValue>> {
    const matchingSurveyAnswers = this.filterThisCategorysSurveyAnswers(surveyAnswers);
    return matchingSurveyAnswers.map((surveyAnswer) =>
      this.transformSurveyAnswer(externalCalculationData, surveyAnswer, actionAnswers),
    );
  }

  /**
   * Transforms a given survey answer using the given survey answers.
   * The returned survey answer essentially incorporates the action answers afterwards.
   */
  public abstract transformSurveyAnswer(
    externalCalculationData: ExternalCalculationData,
    surveyAnswer: SurveyAnswer<TSurveyAnswerValue>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ): SurveyAnswer<TSurveyAnswerValue>;

  //
  // Helpers.
  //

  protected filterThisCategorysSurveyAnswers(
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
  ): IDataFrame<number, SurveyAnswer<TSurveyAnswerValue>> {
    return surveyAnswers.filter((surveyAnswer) => isSurveyAnswerType(this.surveyId, surveyAnswer)) as any;
  }

  protected getRealEstateBaseData(externalCalculationData: ExternalCalculationData, realEstateId: string) {
    return externalCalculationData.baseData.filter((baseData) => baseData.realEstateId === realEstateId).first();
  }

  protected getDeltaResult(before: number, after: number): DeltaResult {
    const delta = after - before;
    const deltaType = getDeltaType(delta);

    return {
      before,
      after,
      delta,
      deltaType,
    };
  }
}
