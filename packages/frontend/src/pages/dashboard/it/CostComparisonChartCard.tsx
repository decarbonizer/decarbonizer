import { Select } from '@chakra-ui/react';
import { Series } from 'data-forge';
import range from 'lodash-es/range';
import { useState } from 'react';
import { getSurveyAnswersForSurvey } from '../../../calculationsLegacy/surveyAnswers/getSurveyAnswersForSurvey';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import ComparisonChartCard from '../components/ComparisonChartCard';
import {
  getItMaintenanceCostForYear,
  getInitialItReplacementCost,
  getTransformedItMaintenanceCostForYear,
} from '../../../calculationsLegacy/it/maintenanceCost';
import {
  getItElectricityCostPerYear,
  getTransformedItElectricityCostPerYear,
} from '../../../calculationsLegacy/it/cost';

type CostCategory = 'all' | 'electricity' | 'maintenance';

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const itSurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'it');
      const oldElectricityCostsPerYear = Math.round(
        getItElectricityCostPerYear(
          externalCalculationData,
          itSurveyAnswers.map((answer) => answer.value),
        ),
      );
      const newElectricityCostsPerYear = Math.round(
        getTransformedItElectricityCostPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      );

      const years = new Series(range(1, 11));
      const oldMaintenanceCosts = years.map((year) =>
        Math.round(
          getItMaintenanceCostForYear(
            itSurveyAnswers.map((answer) => answer.value),
            year,
          ).maintenanceCostThisYear,
        ),
      );
      const newMaintenanceCosts = years.map((year) =>
        Math.round(
          year === 1
            ? getInitialItReplacementCost(itSurveyAnswers, filledActionAnswersDf)
            : 0 +
                getTransformedItMaintenanceCostForYear(itSurveyAnswers, filledActionAnswersDf, year)
                  .maintenanceCostThisYear,
        ),
      );
      const oldCostsPerYear = oldMaintenanceCosts.map(
        (maintenanceCost) => maintenanceCost + oldElectricityCostsPerYear,
      );
      const newCostsPerYear = newMaintenanceCosts.map(
        (maintenanceCost) => maintenanceCost + newElectricityCostsPerYear,
      );

      return years
        .map((year) => ({
          Year: year,
          'Old costs': oldCostsPerYear.take(year).sum(),
          'New costs': newCostsPerYear.take(year).sum(),
          'Old maintenance costs': oldMaintenanceCosts.take(year).sum(),
          'New maintenance costs': newMaintenanceCosts.take(year).sum(),
          'Old electricity costs': oldElectricityCostsPerYear * year,
          'New electricity costs': newElectricityCostsPerYear * year,
        }))
        .toArray();
    },
    [filledActionAnswersDf],
  );
  const [selectedCostCategory, setSelectedCostCategory] = useState<CostCategory>('all');

  const { oldDataKey, newDataKey } = getDataKeys();

  return (
    <ComparisonChartCard
      {...props}
      headerControls={
        <Select
          size="sm"
          maxW="40"
          defaultValue="all"
          onChange={(e) => setSelectedCostCategory(e.target.value as CostCategory)}>
          <option value="all">All</option>
          <option value="electricity">Electricity</option>
          <option value="maintenance">Maintenance</option>
        </Select>
      }
      unit="€"
      header="Cost comparison over 10 years"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="itCostComparison"
      oldDataKey={oldDataKey}
      newDataKey={newDataKey}
    />
  );

  function getDataKeys() {
    switch (selectedCostCategory) {
      case 'all':
        return {
          oldDataKey: 'Old costs',
          newDataKey: 'New costs',
        };
      case 'electricity':
        return {
          oldDataKey: 'Old electricity costs',
          newDataKey: 'New electricity costs',
        };
      case 'maintenance':
        return {
          oldDataKey: 'Old maintenance costs',
          newDataKey: 'New maintenance costs',
        };
    }
  }
}
