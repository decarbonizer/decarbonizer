import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import { useEffect } from 'react';
import { Bulb } from '../../../api/bulb';
import { calculateIllumnitationData, IlluminationCalculation, SurveyAnswer } from '../../../api/surveyAnswer';
import IlluminationDataCards from './IlluminationDataCards';

interface IlluminationOverviewComponentProps {
  isLoadingSurveyAnswers: boolean;
  surveyAnswers: SurveyAnswer<object>[] | undefined;
  isLoadingBulbs: boolean;
  bulbs: Bulb[] | undefined;
}

export default function IlluminationOverviewComponent({
  isLoadingSurveyAnswers,
  surveyAnswers,
  isLoadingBulbs,
  bulbs,
}: IlluminationOverviewComponentProps) {
  const [illuminationData, setIlluminationData] = React.useState<Array<IlluminationCalculation>>([]);

  useEffect(() => {
    if (surveyAnswers && bulbs) {
      const data = calculateIllumnitationData(surveyAnswers, bulbs);
      console.log(data);
      setIlluminationData(data);
    }
  }, [surveyAnswers, bulbs]);

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

  return <IlluminationDataCards illuminationData={illuminationData} />;
}
