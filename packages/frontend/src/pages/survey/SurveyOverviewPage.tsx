import { Drawer, DrawerContent, DrawerOverlay, Wrap, WrapItem } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SurveyView from './SurveyView';
import SurveyCard from './SurveyCard';
import { useState } from 'react';
import { useParams } from 'react-router';
import { SurveysPageParams } from '../../routes';
import { knownSurveys, Survey } from '../../data/surveys/survey';
import Searchbar from '../../components/Searchbar';
import EmptyState from '../../components/EmptyState';
import cloud from '../../img/cloud.svg';

export default function SurveyOverviewPage() {
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);
  const { realEstateId } = useParams<SurveysPageParams>();
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredSurveyCategory = Object.values(knownSurveys).filter((survey) => {
    return survey.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const finishSurvey = () => {
    setActiveSurvey(undefined);
  };

  return (
    <DefaultPageLayout
      title="Surveys"
      actions={<Searchbar placeholder="Search for category.." onChange={setSearchValue} />}>
      <Wrap spacing="4">
        {filteredSurveyCategory.length === 0 ? (
          <EmptyState imgSrc={cloud} title="No Result" description={`Could not find a survey category`} />
        ) : (
          filteredSurveyCategory.map((survey) => (
            <WrapItem key={survey.id} alignItems="stretch">
              <SurveyCard
                key={survey.id}
                realEstateId={realEstateId}
                survey={survey}
                onNewClick={() => setActiveSurvey(survey)}
              />
            </WrapItem>
          ))
        )}
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
