import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  Spacer,
  IconButton,
  Tooltip,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { IoBulbOutline } from 'react-icons/io5';
import { useMemo, useState } from 'react';
import { useDeleteSurveyAnswerMutation } from '../../store/api';
import { useParams } from 'react-router';
import { SurveysPageParams } from '../../routes';
import SurveyView from './SurveyView';
import { knownSurveys } from '../../data/surveys/survey';
import SortingSelection, { SortCategory, SortValueChangedArgs } from '../../components/SortingSelection';
import orderBy from 'lodash-es/orderBy';
import DeleteAlertDialog from '../../components/DeleteAlertDialog';

export interface SurveyAnswerDrawer {
  isOpen: boolean;
  onClose: () => void;
  surveyAnswers: Array<SurveyAnswer>;
}

export function SurveyAnswerDrawer({ isOpen, onClose, surveyAnswers }: SurveyAnswerDrawer) {
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const [deleteSurveyAnswerMutation] = useDeleteSurveyAnswerMutation();
  const [currentSortValue, setCurrentSortValue] = useState<SortValueChangedArgs>({
    sortCategory: 'value.realEstateName',
    sortDirection: 'asc',
  });
  const [activeSurveyAnswer, setActiveSurveyAnswer] = useState<SurveyAnswer | undefined>(undefined);
  const toast = useToast();
  const onConfirm = async (surveyAnswer) => {
    await deleteSurveyAnswerMutation({ id: surveyAnswer._id });
    toast({
      title: 'Survey answer deleted.',
      description: 'Survey answer has been successfully deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const { realEstateId } = useParams<SurveysPageParams>();
  const sortedSurveyAnswers = useMemo(
    () => orderBy(surveyAnswers, [currentSortValue.sortCategory], [currentSortValue.sortDirection]),
    [surveyAnswers, currentSortValue],
  );

  const finishSurvey = () => {
    setActiveSurveyAnswer(undefined);
  };

  const survey = knownSurveys[surveyAnswers[0].surveyId];

  const sortCategory: SortCategory[] = [
    { value: 'value.realEstateName', display: 'Name' },
    { value: 'createdAt', display: 'Created at' },
    { value: 'updatedAt', display: 'Updated at' },
  ];
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader pt="10" pb="10">
          <Icon as={IoBulbOutline} /> {survey.name} Survey Answers
        </DrawerHeader>
        <DrawerBody>
          <VStack align="flex-start" pb="5">
            <SortingSelection sortingCategories={sortCategory} onChange={setCurrentSortValue} />
          </VStack>
          <Table>
            <Tbody>
              {sortedSurveyAnswers?.map((surveyAnswer) => (
                <Tr key={surveyAnswer._id}>
                  <Td display="flex">
                    <VStack align="flex-start">
                      <Text>{(surveyAnswer.value as any).realEstateName}</Text>
                      <HStack>
                        <Badge>Created: {new Date(surveyAnswer.createdAt).toLocaleDateString()}</Badge>
                        <Badge>Modified: {new Date(surveyAnswer.updatedAt).toLocaleDateString()}</Badge>
                      </HStack>
                      {(surveyAnswer.value as any).isInitialSurvey && <Badge colorScheme="primary">Baseline</Badge>}
                    </VStack>
                    <Spacer />
                    <Tooltip label="Edit" hasArrow>
                      <IconButton
                        aria-label="edit"
                        icon={<FaEdit />}
                        mr="1"
                        onClick={() => setActiveSurveyAnswer(surveyAnswer)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete" hasArrow>
                      <IconButton aria-label="delete" fontSize="21" icon={<MdDeleteForever />} onClick={onOpenAlert} />
                    </Tooltip>
                    <DeleteAlertDialog
                      isOpen={isOpenAlert}
                      onCancel={onCloseAlert}
                      onConfirm={() => onConfirm(surveyAnswer)}
                      deleteTextHeader="Delete survey answer?"
                      deleteTextDialog="Are you sure you want to delete your survey answer?"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
      <Drawer placement="bottom" size="full" isOpen={!!activeSurveyAnswer} onClose={null!}>
        <DrawerOverlay />
        <DrawerContent>
          {activeSurveyAnswer && (
            <SurveyView
              realEstateId={realEstateId}
              surveyId={survey.id}
              onDone={finishSurvey}
              initialSurveyValue={activeSurveyAnswer}
            />
          )}
        </DrawerContent>
      </Drawer>
    </Drawer>
  );
}
