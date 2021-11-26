import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useMemo } from 'react';
import { calculateIllumitationData } from '../../../api/surveyAnswer';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllBulbsQuery } from '../../../store/api';
import IlluminationDataCards from './IlluminationDataCards';

interface IlluminationOverviewComponentProps {
  realEstateId: string;
}

export default function IlluminationOverviewComponent({ realEstateId }: IlluminationOverviewComponentProps) {
  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const illuminationData = useMemo(
    () => (surveyAnswers && bulbs ? calculateIllumitationData(surveyAnswers, bulbs) : []),
    [surveyAnswers, bulbs],
  );

  if (isLoadingSurveyAnswers || isLoadingBulbs) {
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
  }

  if (!surveyAnswers || !bulbs) {
    return (
      <Box position="absolute" left="50%" top="30%" transform="translate(-50%, -50%)">
        Something went wrong!
      </Box>
    );
  }

  return <IlluminationDataCards illuminationData={illuminationData} />;
}
