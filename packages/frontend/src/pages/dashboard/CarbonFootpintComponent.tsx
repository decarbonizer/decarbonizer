import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import { useEffect } from 'react';
import { Bulb } from '../../api/bulb';
import { caclucateOverallFootprintForRealEstate, SurveyAnswer } from '../../api/surveyAnswer';
import CarbonFootprintCard from './CarbonFootprintCard';

interface CarbonPootprintComponentProps {
  isLoadingSurveyAnswers: boolean;
  surveyAnswers: SurveyAnswer<object>[] | undefined;
  isLoadingBulbs: boolean;
  bulbs: Bulb[] | undefined;
}

export default function CarbonFootprintComponent({
  isLoadingSurveyAnswers,
  surveyAnswers,
  isLoadingBulbs,
  bulbs,
}: CarbonPootprintComponentProps) {
  const [carbonFootprint, setCarbonFootprint] = React.useState('');
  const [unitSymbol, setUnitSymbol] = React.useState('kg');

  useEffect(() => {
    if (surveyAnswers && bulbs) {
      const value = caclucateOverallFootprintForRealEstate(surveyAnswers, bulbs);
      if (value >= 1000) {
        const valueInTonnes = value / 1000;
        setUnitSymbol('t');
        setCarbonFootprint(valueInTonnes.toFixed(1));
      } else {
        setCarbonFootprint(value.toFixed(1));
      }
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

  return <CarbonFootprintCard carbonFootprintValue={carbonFootprint} unitSymbol={unitSymbol} />;
}
