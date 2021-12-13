import { Tooltip, ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from 'recharts';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import distinctColors from 'distinct-colors';
import { useCalculation } from '../../../calculations/useCalculation';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import { useParams } from 'react-router';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { RealEstatePageParams } from '../../../routes';
import { DataFrame } from 'data-forge';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { SkeletonText } from '@chakra-ui/react';

const palette = distinctColors({ count: 100 });

export default function ComparisonCard(props: DashboardCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const { realEstates, surveyAnswers } = externalCalculationData;
      return realEstates
        .map((realEstate) => {
          const thisRealEstateSurveyAnswers = surveyAnswers.filter(
            (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
          );

          return {
            realEstate,
            footprint:
              thisRealEstateSurveyAnswers.count() > 0
                ? Math.round(
                    getTransformedFootprintPerYear(
                      externalCalculationData,
                      thisRealEstateSurveyAnswers,
                      realEstate._id === realEstateId
                        ? filledActionAnswersDf
                        : new DataFrame<number, ActionAnswerBase>(),
                    ).globalFootprint,
                  )
                : 0,
          };
        })
        .reduce((result, previous) => ({ ...result, [previous.realEstate.cityName]: previous.footprint }), {});
    },
    [filledActionAnswersDf, realEstateId],
  );

  return (
    <DashboardCard header="Compared to other real estates" {...props}>
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
            </BarChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
