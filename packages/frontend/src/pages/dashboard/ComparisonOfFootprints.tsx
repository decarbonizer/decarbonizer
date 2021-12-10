import { Box, Spinner } from '@chakra-ui/react';
import { useMemo } from 'react';
import { calculateFootprintPerRealEstate } from '../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllRealEstatesQuery, useGetAllSurveyAnswersQuery } from '../../store/api';
import ComparisonCard from './ComparisonCard';

export default function ComparisonOfFootprints() {
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const { isLoading: isLoadingAllSurveyAnswers, data: allSurveyAnswers } = useGetAllSurveyAnswersQuery();
  const calculations = useMemo(
    () =>
      allSurveyAnswers && bulbs && realEstates
        ? calculateFootprintPerRealEstate(allSurveyAnswers, bulbs, realEstates)
        : [],
    [allSurveyAnswers, bulbs, realEstates],
  );

  if (isLoadingAllSurveyAnswers || isLoadingBulbs || isLoadingRealEstates) {
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

  if (!allSurveyAnswers || !bulbs || !realEstates) {
    return (
      <Box position="absolute" left="50%" top="30%" transform="translate(-50%, -50%)">
        Something went wrong!
      </Box>
    );
  }

  return <ComparisonCard calculations={calculations} />;
}
