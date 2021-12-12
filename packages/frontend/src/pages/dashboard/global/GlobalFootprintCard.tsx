import { useMemo } from 'react';
import { GiFootprint } from 'react-icons/gi';
import { useParams } from 'react-router';
import { Bulb } from '../../../api/bulb';
import { calculateOverallFootprintAndMaintenance, SurveyAnswer } from '../../../api/surveyAnswer';
import HaloIcon from '../../../components/HaloIcon';
import { RealEstatePageParams } from '../../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllBulbsQuery } from '../../../store/api';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';

export default function GlobalFootprintCard(props: DashboardCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: bulbs } = useGetAllBulbsQuery();
  const carbonFootprint = useMemo(
    () => (surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0),
    [surveyAnswers, bulbs],
  );
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint
        </>
      }
      {...props}>
      <QuickInfo icon={<HaloIcon icon={GiFootprint} />}>
        <QuickInfoLabelDescription
          label={
            <>
              {adjustedFootprint.toFixed(1)}
              {unitSymbol}
            </>
          }
        />
      </QuickInfo>
    </DashboardCard>
  );
}

function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
  const value = calculateOverallFootprintAndMaintenance(answers, bulbs, 1).calculations;
  return +value[1].footprint.toFixed(1);
}
