import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Bulb } from '../../api/bulb';
import { RealEstate } from '../../api/realEstate';
import { caclucateFootprintPerRealEstate, RealEstateFootprintCalculation, SurveyAnswer } from '../../api/surveyAnswer';
import ComparisonCard from './ComparisonCard';

interface ComparisonComponentProps {
  isLoadingAllSurveyAnswers: boolean;
  allSurveyAnswers: SurveyAnswer<object>[] | undefined;
  isLoadingBulbs: boolean;
  bulbs: Bulb[] | undefined;
  isLoadingRealEstates: boolean;
  realEstates: RealEstate[] | undefined;
}

export default function ComparisonComponent({
  isLoadingAllSurveyAnswers,
  allSurveyAnswers,
  isLoadingBulbs,
  bulbs,
  isLoadingRealEstates,
  realEstates,
}: ComparisonComponentProps) {
  const [calculations, setCalculations] = React.useState<Array<RealEstateFootprintCalculation>>([]);

  useEffect(() => {
    if (allSurveyAnswers && bulbs && realEstates) {
      const value = caclucateFootprintPerRealEstate(allSurveyAnswers, bulbs, realEstates);
      console.log(value);
      setCalculations(value);
      console.log(calculations);
    }
  }, [allSurveyAnswers, bulbs, realEstates]);

  if (isLoadingAllSurveyAnswers || isLoadingBulbs || isLoadingRealEstates)
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
  if (!allSurveyAnswers || !bulbs || !realEstates)
    return (
      <Box position="absolute" left="50%" top="30%" transform="translate(-50%, -50%)">
        Something went wrong!
      </Box>
    );

  return <ComparisonCard calculations={calculations} />;
}
