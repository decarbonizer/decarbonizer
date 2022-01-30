import { SkeletonText } from '@chakra-ui/react';
import distinctColors from 'distinct-colors';
import { ResponsiveContainer, BarChart, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import DashboardCard, { DashboardCardProps } from '../../dashboard/components/DashboardCard';

const palette = distinctColors({ count: 100 });

export default function ComparisonCard(props: DashboardCardProps) {
  const { isLoading, data, error } = useCalculation((externalCalculationData) => {
    const { realEstates, surveyAnswers, actionPlans } = externalCalculationData;

    return realEstates
      .map((realEstate) => {
        const thisRealEstateSurveyAnswers = surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );
        const thisRealEstateActionAnswers = actionPlans
          .filter((actionPlan) => actionPlan.realEstateId === realEstate._id)
          .flatMap((actionPlan) => actionPlan.actionAnswers);

        return {
          realEstate,
          footprint:
            thisRealEstateSurveyAnswers.count() > 0
              ? Math.round(
                  getTransformedFootprintPerYear(
                    externalCalculationData,
                    thisRealEstateSurveyAnswers,
                    thisRealEstateActionAnswers,
                  ).globalFootprint,
                )
              : 0,
        };
      })
      .reduce((result, previous) => ({ ...result, [previous.realEstate.cityName]: previous.footprint }), {});
  });

  return (
    <DashboardCard header="Comparison of all real estates" {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[data]}>
              <Tooltip />
              <XAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <YAxis type="category" domain={['dataMin', 'dataMax']} hide />
              {Object.entries(data).map(([realEstateName], i) => (
                <Bar
                  key={realEstateName}
                  label="Test"
                  dataKey={realEstateName}
                  stackId="co2"
                  fill={palette[i]}
                  opacity={0.6}
                  unit="kg"
                />
              ))}
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
