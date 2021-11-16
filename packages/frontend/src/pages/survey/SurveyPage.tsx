import { Button, VStack } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyContainer from './SurveyContainer';

export default function SurveyPage() {
  const surveysMenu = (
    <VStack minW="20vw" align="stretch">
      <Button variant="solid">Energy</Button>
      <Button variant="solid">Energy</Button>
      <Button variant="solid">Energy</Button>
      <Button variant="solid">Energy</Button>
    </VStack>
  );

  return (
    <DefaultPageLayout title="Surveys" leftArea={surveysMenu}>
      <SurveyContainer />
    </DefaultPageLayout>
  );
}
