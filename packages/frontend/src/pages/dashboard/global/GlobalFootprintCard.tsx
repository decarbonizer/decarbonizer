import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Bulb } from '../../../api/bulb';
import { calculateOverallFootprint, SurveyAnswer } from '../../../api/surveyAnswer';
import { RealEstatePageParams } from '../../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllBulbsQuery } from '../../../store/api';
import { IconDashboardCardProps } from '../components/IconDashboardCard';
import CarbonFootprintCard from '../components/CarbonFootprintCard';

export default function GlobalFootprintCard(props: Partial<IconDashboardCardProps>) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: bulbs } = useGetAllBulbsQuery();
  const carbonFootprint = useMemo(
    () => (surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0),
    [surveyAnswers, bulbs],
  );

  return <CarbonFootprintCard carbonFootprint={carbonFootprint} {...props} />;
}

function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
  const value = calculateOverallFootprint(answers, bulbs, 1);
  return +value[0].footprint.toFixed(1);
}
