import { VStack, Button, Skeleton } from '@chakra-ui/react';
import { generatePath, Link, useParams } from 'react-router-dom';
import { Survey } from '../../api/survey';
import { useGetAllSurveysQuery } from '../../store/api';
import range from 'lodash-es/range';
import { routes, SurveysPageParams } from '../../constants';

export default function SurveyMenu() {
  const { isLoading, data = [] } = useGetAllSurveysQuery();

  return (
    <VStack minW="15vw" align="stretch">
      {isLoading && range(5).map((i) => <Skeleton key={i} />)}
      {data.map((survey) => (
        <SurveyMenuItem key={survey._id} survey={survey} />
      ))}
    </VStack>
  );
}

interface SurveyMenuItemProps {
  survey: Survey;
}

function SurveyMenuItem({ survey }: SurveyMenuItemProps) {
  const params = useParams<SurveysPageParams>();
  const isSelected = params['surveyId'] === survey._id;

  return (
    <Link to={routes.surveys({ ...params, surveyId: survey._id })}>
      <Button w="100%" colorScheme={isSelected ? 'primary' : undefined} variant={isSelected ? 'solid' : 'ghost'}>
        {survey.name}
      </Button>
    </Link>
  );
}
