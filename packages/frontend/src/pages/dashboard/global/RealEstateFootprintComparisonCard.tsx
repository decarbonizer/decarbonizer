import { Tooltip, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Legend } from 'recharts';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import {
  useFilledActionAnswersDataFrame,
  useTransformedSurveyAnswersForThisActionPlanDashboard,
} from '../dashboardContext';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { SkeletonText } from '@chakra-ui/react';
import { palette } from '../../../utils/colorsChart';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

export default function RealEstateFootprintComparisonCard(props: DashboardCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const surveyAnswers = useTransformedSurveyAnswersForThisActionPlanDashboard();
  const { isLoading, data, error } = useAsyncCalculation(
    'getRealEstateFootprintComparisonCardData',
    () => [surveyAnswers.data!, filledActionAnswersDf.toArray(), realEstateId],
    { skip: !surveyAnswers.data },
    [surveyAnswers, realEstateId, filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Compared to other real estates" showRevalidatingSpinner={isLoading} {...props}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[data]}>
              <Tooltip />
              <XAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <YAxis type="category" domain={['dataMin', 'dataMax']} hide />
              {Object.entries(data).map(([realEstateName], i) => (
                <Bar
                  key={realEstateName}
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
