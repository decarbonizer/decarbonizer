import { Grid } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { Calculation, recalculateFootprintAndMaintenance } from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import { ActionPanelContext } from '../action-panel/actionPanelContext';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import CostDeltaCard from './CostDeltaCard';
import MaintenanceComparisonCard from './MaintenanceComparisonCard';

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
            comparisonOfFootprintAndCosts: undefined,
            comparisonOfMaintenance: undefined,
          },
    [surveyAnswers, bulbs, filledActionAnswers],
  );

  const oldCalculation: Calculation = useMemo(
    () =>
      newData.comparisonOfFootprintAndCosts
        ? {
            costs: newData.comparisonOfFootprintAndCosts[1].oldCosts,
            footprint: newData.comparisonOfFootprintAndCosts[1].oldFootprint,
            year: newData.comparisonOfFootprintAndCosts[0].year,
          }
        : { costs: 0, footprint: 0, year: 0 },
    [newData],
  );

  const newCalculation: Calculation = useMemo(
    () =>
      newData.comparisonOfFootprintAndCosts
        ? {
            costs: newData.comparisonOfFootprintAndCosts[1].newCosts,
            footprint: newData.comparisonOfFootprintAndCosts[1].newFootprint,
            year: newData.comparisonOfFootprintAndCosts[0].year,
          }
        : { costs: 0, footprint: 0, year: 0 },
    [newData],
  );

  return (
    <Grid flexGrow={1} templateColumns="repeat(6, 1fr)" templateRows="auto 1fr" gap="6">
      <FootprintDeltaCard
        gridRow="1"
        gridColumn="1 / span 2"
        oldCalculation={oldCalculation}
        newCalculation={newCalculation}
      />
      <CostDeltaCard
        gridRow="1"
        gridColumn="3 / span 2"
        oldCalculation={oldCalculation}
        newCalculation={newCalculation}
      />{' '}
      {newData.comparisonOfFootprintAndCosts != undefined ? (
        <ComparisonOfCostsAndFootprints
          gridRow="2 / span 13"
          gridColumn="1 / span 3"
          data={newData.comparisonOfFootprintAndCosts}
        />
      ) : (
        <></>
      )}
      {newData.comparisonOfMaintenance != undefined ? (
        <MaintenanceComparisonCard
          gridRow="2 / span 13"
          gridColumn="4 / span 6"
          data={newData.comparisonOfMaintenance}
        />
      ) : (
        <></>
      )}
      {newData.newIllumination ? (
        <CalculatedCostsCard gridRow="15" gridColumn="1 / span 2" calculatedCosts={newData.newIllumination} />
      ) : (
        <></>
      )}
    </Grid>
  );
}
