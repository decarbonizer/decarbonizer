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
import { useRef } from 'react';

export interface SurveyAnswerDrawer {
  isOpen: boolean;
  onClose: () => void;
  surveyAnswers?: Array<SurveyAnswer>;
}

export function SurveyAnswerDrawer({ isOpen, onClose, surveyAnswers }: SurveyAnswerDrawer) {
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
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
                      <IconButton aria-label="edit" icon={<FaEdit />} mr="1" />
                    </Tooltip>
                    <Tooltip label="Delete" hasArrow>
                      <IconButton aria-label="delete" fontSize="21" icon={<MdDeleteForever />} onClick={onOpenAlert} />
                    </Tooltip>
                    <DeleteAlertDialog isOpen={isOpenAlert} onClose={onCloseAlert} />
                  </Td>
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
  onClose: () => void;
}

function DeleteAlertDialog({ isOpen, onClose }: DeleteAlertDialogProps) {
  const cancelRef = useRef<any>();

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Delete survey answer?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>Are you sure you want to delete your survey answer?</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No, keep it.
          </Button>
          <Button colorScheme="red" ml={3}>
            Yes, delete it.
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
