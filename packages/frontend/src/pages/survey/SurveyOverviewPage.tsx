import { Drawer, DrawerContent, DrawerOverlay, Flex } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyView from './SurveyView';
import { useGetAllSurveysQuery } from '../../store/api';
import SurveyCard from './SurveyCard';
import { useState } from 'react';
import { Survey } from '../../api/survey';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { routes, SurveysPageParams } from '../../routes';

export default function SurveyOverviewPage() {
  const { data } = useGetAllSurveysQuery();
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
        {data &&
          data.map((survey) => (
            <SurveyCard
              key={survey._id}
              realEstateId={realEstateId}
              survey={survey}
              onNewClick={() => setActiveSurvey(survey)}
            />
          ))}
      </Flex>
      <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurvey && <SurveyView realEstateId={realEstateId} surveyId={activeSurvey._id} onDone={finishSurvey} />}
        </DrawerContent>
      </Drawer>
    </DefaultPageLayout>
  );
}
