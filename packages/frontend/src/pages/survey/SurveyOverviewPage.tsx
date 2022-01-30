import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Tooltip,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
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
import BaseDataModal from '../../components/BaseDataModal';
import { FcDataConfiguration } from 'react-icons/fc';

export default function SurveyOverviewPage() {
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);
  const { realEstateId } = useParams<SurveysPageParams>();
  const [searchValue, setSearchValue] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredSurveyCategory = Object.values(knownSurveys).filter((survey) => {
    return survey.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const finishSurvey = () => {
    setActiveSurvey(undefined);
  };

  return (
    <DefaultPageLayout
      title="Surveys"
      actions={
        <HStack>
          <Tooltip label="Base Data">
            <IconButton
              aria-label="Base Data"
              onClick={onOpen}
              variant="outline"
              icon={<FcDataConfiguration size="20" />}
            />
          </Tooltip>

          <Searchbar placeholder="Search for category.." onChange={setSearchValue} />
        </HStack>
      }>
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
      <BaseDataModal isOpen={isOpen} onClose={onClose} />
      <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurvey && <SurveyView realEstateId={realEstateId} surveyId={activeSurvey.id} onDone={finishSurvey} />}
        </DrawerContent>
      </Drawer>
    </DefaultPageLayout>
  );
}
