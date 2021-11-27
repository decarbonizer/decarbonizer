import { Drawer, DrawerContent, DrawerOverlay, Flex } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyView from './SurveyView';
import SurveyCard from './SurveyCard';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { routes, SurveysPageParams } from '../../routes';
import { knownSurveys, Survey } from '../../data/surveys/survey';

export default function SurveyOverviewPage() {
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);
  const { realEstateId } = useParams<SurveysPageParams>();
  const history = useHistory();

  const finishSurvey = () => {
    setActiveSurvey(undefined);
    history.push(routes.realEstateDashboard({ realEstateId }));
  };

  return (
    <DefaultPageLayout title="Surveys">
      <Flex>
        {Object.values(knownSurveys).map((survey) => (
          <SurveyCard
            key={survey.id}
            realEstateId={realEstateId}
            survey={survey}
            onNewClick={() => setActiveSurvey(survey)}
          />
        ))}
      </Flex>
      <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurvey && <SurveyView realEstateId={realEstateId} surveyId={activeSurvey.id} onDone={finishSurvey} />}
        </DrawerContent>
      </Drawer>
    </DefaultPageLayout>
  );
}
