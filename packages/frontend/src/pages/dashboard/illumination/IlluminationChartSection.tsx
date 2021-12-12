import { Grid } from '@chakra-ui/react';
import { useContext, useEffect, useMemo } from 'react';
import {
  changeIllumination,
  ComparisonOfCalculations,
  recalculateFootprintAndMaintenance,
} from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import { ActionPanelContext } from '../action-panel/actionPanelContext';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import CostDeltaCard from './CostDeltaCard';

export default function IlluminationChartsSection() {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { filledActionAnswers } = useContext(ActionPanelContext);

  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { data: bulbs } = useGetAllBulbsQuery();

  const newData = useMemo(
    () =>
      surveyAnswers && bulbs && (filledActionAnswers.changeRuntime || filledActionAnswers.changeBulbs)
        ? recalculateFootprintAndMaintenance(surveyAnswers, filledActionAnswers, bulbs)
        : {
            newIllumination: undefined,
            oldCalculation: {
              calculations: [{ costs: 0, footprint: 0, year: 0 }],
              maintenance: [{ costsForBulbsReplacement: 0, costsForBulbs: 0, year: 0 }],
            },
            newCalculation: {
              calculations: [{ costs: 0, footprint: 0, year: 0 }],
              maintainance: [{ costsForBulbsReplacement: 0, costsForBulbs: 0, year: 0 }],
            },
          },
    [surveyAnswers, bulbs, filledActionAnswers],
  );

  const dataForComparison: ComparisonOfCalculations[] = useMemo(() => prepareDataForComparison(), [newData]);
  function prepareDataForComparison(): ComparisonOfCalculations[] {
    if (newData) {
      return newData.oldCalculation.calculations.map((item) => {
        const item2 = newData.newCalculation.calculations.find((calc) => calc.year == item.year);
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
        oldCalculation={newData.oldCalculation.calculations[0]}
        newCalculation={newData.newCalculation.calculations[0]}
      />
      <CostDeltaCard
        gridRow="1"
        gridColumn="3 / span 2"
        oldCalculation={newData.oldCalculation.calculations[0]}
        newCalculation={newData.newCalculation.calculations[0]}
      />
      {newData.newIllumination ? (
        <CalculatedCostsCard gridRow="2" gridColumn="1 / span 2" calculatedCosts={newData.newIllumination} />
      ) : (
        <></>
      )}
      <ComparisonOfCostsAndFootprints gridRow="2" gridColumn="3 / span 4" data={dataForComparison} />
    </Grid>
  );
}
