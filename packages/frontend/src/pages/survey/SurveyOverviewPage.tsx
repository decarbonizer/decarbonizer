import { Drawer, DrawerContent, DrawerOverlay, Wrap, WrapItem } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyView from './SurveyView';
import SurveyCard from './SurveyCard';
import { useState } from 'react';
import { useParams } from 'react-router';
import { SurveysPageParams } from '../../routes';
import { knownSurveys, Survey } from '../../data/surveys/survey';
import MenuNavigation from '../../components/MenuNavigation';

export default function SurveyOverviewPage() {
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);
  const { realEstateId } = useParams<SurveysPageParams>();

  const finishSurvey = () => {
    setActiveSurvey(undefined);
  };

  return (
    <DefaultPageLayout title="Surveys">
      <Wrap spacing="4">
        {Object.values(knownSurveys).map((survey) => (
          <WrapItem key={survey.id} alignItems="stretch">
            <SurveyCard
              key={survey.id}
              realEstateId={realEstateId}
              survey={survey}
              onNewClick={() => setActiveSurvey(survey)}
            />
          </WrapItem>
        ))}
      </Wrap>
      <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurvey && <SurveyView realEstateId={realEstateId} surveyId={activeSurvey.id} onDone={finishSurvey} />}
        </DrawerContent>
      </Drawer>
    </DefaultPageLayout>
  );
}
