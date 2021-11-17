import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import CreateRealEstateForm from './CreateRealEstateForm';

interface CreateRealEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRealEstateModal({ isOpen, onClose }: CreateRealEstateModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new real estate</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CreateRealEstateForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
