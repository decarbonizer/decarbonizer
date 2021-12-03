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

export interface DeleteAlertDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  deleteTextHeader: string;
  deleteTextDialog: string;
}

export default function DeleteAlertDialog({
  isOpen,
  onCancel,
  onConfirm,
  deleteTextHeader,
  deleteTextDialog,
}: DeleteAlertDialogProps) {
  const cancelRef = useRef<any>();

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onCancel} isOpen={isOpen}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{deleteTextHeader}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{deleteTextDialog}</AlertDialogBody>
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
