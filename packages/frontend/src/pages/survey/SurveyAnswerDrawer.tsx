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
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useRef, useState } from 'react';
import { useDeleteSurveyAnswerMutation } from '../../store/api';
import { useParams } from 'react-router';
import { SurveysPageParams } from '../../routes';
import SurveyView from './SurveyView';
import { knownSurveys, Survey } from '../../data/surveys/survey';

export interface SurveyAnswerDrawer {
  isOpen: boolean;
  onClose: () => void;
  surveyAnswers?: Array<SurveyAnswer>;
}

export function SurveyAnswerDrawer({ isOpen, onClose, surveyAnswers }: SurveyAnswerDrawer) {
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const [deleteSurveyAnswerMutation] = useDeleteSurveyAnswerMutation();
  const onConfirm = (surveyAnswer) => {
    deleteSurveyAnswerMutation({ id: surveyAnswer._id });
  };

  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>(undefined);
  const { realEstateId } = useParams<SurveysPageParams>();

  const finishSurvey = () => {
    setActiveSurvey(undefined);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerHeader pt="10"> Survey answer overview </DrawerHeader>

        <DrawerBody>
          <Table>
            <Tbody>
              {surveyAnswers?.map((surveyAnswer) => (
                <Tr key={surveyAnswer._id}>
                  <Td display="flex" alignItems="center">
                    <Text>{(surveyAnswer.value as any).realEstateName}</Text>
                    <Spacer />
                    <Tooltip label="Edit" hasArrow>
                      <IconButton
                        aria-label="edit"
                        icon={<FaEdit />}
                        mr="1"
                        onClick={() => setActiveSurvey(knownSurveys[surveyAnswer.surveyId])}
                      />
                    </Tooltip>
                    <Tooltip label="Delete" hasArrow>
                      <IconButton aria-label="delete" fontSize="21" icon={<MdDeleteForever />} onClick={onOpenAlert} />
                    </Tooltip>
                    <DeleteAlertDialog
                      isOpen={isOpenAlert}
                      onCancel={onCloseAlert}
                      onConfirm={() => onConfirm(surveyAnswer)}
                    />
                  </Td>
                  <Drawer placement="bottom" size="full" isOpen={!!activeSurvey} onClose={null!}>
                    <DrawerOverlay />
                    <DrawerContent>
                      {activeSurvey && (
                        <SurveyView
                          realEstateId={realEstateId}
                          surveyId={activeSurvey.id}
                          onDone={finishSurvey}
                          initialSurveyValue={surveyAnswer}
                        />
                      )}
                    </DrawerContent>
                  </Drawer>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

interface DeleteAlertDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteAlertDialog({ isOpen, onCancel, onConfirm }: DeleteAlertDialogProps) {
  const cancelRef = useRef<any>();

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onCancel} isOpen={isOpen}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Delete survey answer?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>Are you sure you want to delete your survey answer?</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onCancel}>
            No, keep it.
          </Button>
          <Button colorScheme="red" ml={3} onClick={onConfirm}>
            Yes, delete it.
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
