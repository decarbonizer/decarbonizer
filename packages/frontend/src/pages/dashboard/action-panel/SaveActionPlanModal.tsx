import {
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ActionPlanSummary } from './ActionPlanSummary';

export interface SaveActionPlanModalProps {
  isOpen: boolean;
  onClose(): void;
}

export default function SaveActionPlanModal({ isOpen, onClose }: SaveActionPlanModalProps) {
  const handleSaveClick = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Action Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* TODO: Add name and time range form. */}
          <FormLabel fontWeight="semibold" mt={8}>
            Selected Actions
          </FormLabel>
          <ActionPlanSummary />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr="3">
            Cancel
          </Button>
          <Button colorScheme="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
