import { useMemo } from 'react';
import { Tooltip, ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from 'recharts';
import { calculateFootprintPerRealEstate } from '../../../api/surveyAnswer';
import { useGetAllRealEstatesQuery, useGetAllBulbsQuery, useGetAllSurveyAnswersQuery } from '../../../store/api';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import distinctColors from 'distinct-colors';

export default function ComparisonCard(props: DashboardCardProps) {
  const { data: realEstates } = useGetAllRealEstatesQuery();
  const { data: bulbs } = useGetAllBulbsQuery();
  const { data: allSurveyAnswers } = useGetAllSurveyAnswersQuery();
  const calculations = useMemo(() => {
    if (!allSurveyAnswers || !bulbs || !realEstates) {
      return [];
    }

    const footprintsPerRealEstate = calculateFootprintPerRealEstate(allSurveyAnswers, bulbs, realEstates);
    return footprintsPerRealEstate.reduce(
      (result, previous) => ({ ...result, [previous.name]: previous.footprint }),
      {},
    );
  }, [allSurveyAnswers, bulbs, realEstates]);
  const palette = useMemo(() => distinctColors({ count: Object.keys(calculations).length }), [calculations]);

  return (
    <DashboardCard header="Compared to other real estates" {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={[calculations]}>
          <Tooltip />
          <XAxis type="number" domain={['dataMin', 'dataMax']} hide />
          <YAxis type="category" domain={['dataMin', 'dataMax']} hide />
          {Object.entries(calculations).map(([realEstateName], i) => (
            <Bar key={realEstateName} dataKey={realEstateName} stackId="co2" fill={palette[i]} opacity={0.6} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}
