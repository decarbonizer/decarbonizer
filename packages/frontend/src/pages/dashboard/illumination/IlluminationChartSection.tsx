import { Grid } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { changeBulbs, ComparisonOfCalculations, SurveyAnswer } from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import { ActionPanelContext } from '../action-panel/actionPanelContext';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import CostDeltaCard from './CostDeltaCard';
import { IlluminationSurveyAnswerValue } from '../../../data/surveys/illumination/illuminationSurveyAnswerValue';

export default function IlluminationChartsSection() {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { filledActionAnswers } = useContext(ActionPanelContext);
  const bulbId = filledActionAnswers.changeBulbs?.values.value.newBulb;

  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { data: bulbs } = useGetAllBulbsQuery();

  const newData = useMemo(
    () =>
      bulbId && surveyAnswers && bulbs
        ? changeBulbs(surveyAnswers as SurveyAnswer<IlluminationSurveyAnswerValue>[], bulbs, bulbId)
        : {
            newIllumination: { typeOfBulb: bulbId!, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 },
            oldCalculation: [{ costs: 0, footprint: 0, year: 0 }],
            newCalculation: [{ costs: 0, footprint: 0, year: 0 }],
          },
    [surveyAnswers, bulbs, bulbId],
  );

  const dataForComparison: ComparisonOfCalculations[] = prepareDataForComparison();
  const footprintReduction: number = newData
    ? newData.oldCalculation[0].footprint - newData.newCalculation[0].footprint
    : 0;

  function prepareDataForComparison(): ComparisonOfCalculations[] {
    if (newData) {
      return newData.oldCalculation.map((item) => {
        const item2 = newData.newCalculation.find((calc) => calc.year == item.year);
        return {
          year: item.year,
          oldCosts: item.costs,
          oldFootprint: item.footprint,
          newCosts: item2!.costs,
          newFootprint: item2!.footprint,
        };
      });
    } else {
      return [{ year: 0, oldCosts: 0, oldFootprint: 0, newCosts: 0, newFootprint: 0 }];
    }
  }

  return (
    <Grid flexGrow={1} templateColumns="repeat(6, 1fr)" templateRows="auto 1fr" gap="6">
      <FootprintDeltaCard
        gridRow="1"
        gridColumn="1 / span 2"
        oldCalculation={newData.oldCalculation[0]}
        newCalculation={newData.newCalculation[0]}
      />
      <CostDeltaCard
        gridRow="1"
        gridColumn="3 / span 2"
        oldCalculation={newData.oldCalculation[0]}
        newCalculation={newData.newCalculation[0]}
      />
      <CalculatedCostsCard gridRow="2" gridColumn="1 / span 2" calculatedCosts={newData.newIllumination} />
      <ComparisonOfCostsAndFootprints gridRow="2" gridColumn="3 / span 4" data={dataForComparison} />
    </Grid>
  );
}
