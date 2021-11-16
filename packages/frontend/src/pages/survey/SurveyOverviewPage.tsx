import { Button, Code, Icon, useDisclosure } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyDrawer from './SurveyDrawer';
import { IoAddOutline } from 'react-icons/io5';
import SurveyMenu from './SurveyMenu';
import { useParams } from 'react-router';

export default function SurveyOverviewPage() {
  const surveyDrawerDisclosure = useDisclosure();
  const surveyId = useParams()['surveyId'];

  const pageActions = surveyId
    ? [
        <Button
          key="add-survey"
          colorScheme="primary"
          rightIcon={<Icon as={IoAddOutline} />}
          onClick={surveyDrawerDisclosure.onOpen}>
          New
        </Button>,
      ]
    : [];

  return (
    <DefaultPageLayout title="Surveys" leftArea={<SurveyMenu />} actions={pageActions}>
      {surveyId ? <Code>TODO: Display filled out surveys.</Code> : <Code>TODO: Display survey overview page.</Code>}
      <SurveyDrawer isOpen={surveyDrawerDisclosure.isOpen} onClose={surveyDrawerDisclosure.onClose} />
    </DefaultPageLayout>
  );
}
