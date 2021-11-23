import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React, { useMemo } from 'react';
import { Bulb } from '../../api/bulb';
import { caclucateOverallFootprint, SurveyAnswer } from '../../api/surveyAnswer';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllBulbsQuery } from '../../store/api';
import CarbonFootprintCard from './CarbonFootprintCard';

interface CarbonFootprintComponentProps {
  realEstateId: string;
}

export default function CarbonFootprintComponent({ realEstateId }: CarbonFootprintComponentProps) {
  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const [unitSymbol, setUnitSymbol] = React.useState('kg');
  const carbonFootprint = useMemo(() => surveyAnswers && bulbs? getFootprint(surveyAnswers, bulbs) : "0.0", [surveyAnswers, bulbs]);

  function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]) : string {
    const value = caclucateOverallFootprint(answers, bulbs);
    if (value >= 1000) {
      const valueInTonnes = value / 1000;
      setUnitSymbol('t');
      return valueInTonnes.toFixed(1);
    } else {
      return value.toFixed(1);
    }
  }

  if (isLoadingSurveyAnswers || isLoadingBulbs)
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="green.200"
        color="green.500"
        size="xl"
        position="absolute"
        left="50%"
        top="30%"
        transform="translate(-50%, -50%)"
      />
    );
  if (!surveyAnswers || !bulbs)
    return (
      <Box position="absolute" left="50%" top="30%" transform="translate(-50%, -50%)">
        Something went wrong!
      </Box>
    );

  return <CarbonFootprintCard carbonFootprintValue={carbonFootprint} unitSymbol={unitSymbol} />;
}
