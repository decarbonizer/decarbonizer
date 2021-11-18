import { Drawer, DrawerContent, DrawerOverlay, Flex } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyView from './SurveyView';
import { useGetAllSurveysQuery } from '../../store/api';
import SurveyCard from './SurveyCard';
import { useState } from 'react';
import { Survey } from '../../api/survey';

export default function SurveyOverviewPage() {
  const { data, isLoading } = useGetAllSurveysQuery();
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);

  return (
    <DefaultPageLayout title="Surveys">
      <Flex>
        {data &&
          data.map((survey) => (
            <SurveyCard key={survey._id} survey={survey} onNewClick={() => setActiveSurvey(survey)} />
          ))}
      </Flex>
      <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurvey && <SurveyView surveyId={activeSurvey!._id} onDone={() => setActiveSurvey(undefined)} />}
        </DrawerContent>
      </Drawer>
    </DefaultPageLayout>
  );
}
