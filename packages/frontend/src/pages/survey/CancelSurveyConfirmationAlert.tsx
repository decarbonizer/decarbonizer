import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

export interface CancelSurveyConfirmationAlertProps {
  isOpen: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export default function CancelSurveyConfirmationAlert({
  isOpen,
  onConfirm,
  onCancel,
}: CancelSurveyConfirmationAlertProps) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      motionPreset="slideInBottom"
      isCentered
      isOpen={isOpen}
      onClose={onCancel}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Leave the Survey</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to stop filling out the survey? Your answers will not be saved.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onCancel}>
            No, continue the survey
          </Button>
          <Button colorScheme="red" ml={3} onClick={onConfirm}>
            Yes, stop the survey
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
