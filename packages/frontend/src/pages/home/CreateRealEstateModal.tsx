import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { RealEstate } from '../../api/realEstate';
import CreateRealEstateForm from './CreateRealEstateForm';

interface CreateRealEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  realEstate?: RealEstate;
}

export default function CreateRealEstateModal({ isOpen, onClose, realEstate }: CreateRealEstateModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{realEstate ? `Update ${realEstate.cityName}` : 'Add a new real estate'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CreateRealEstateForm onClose={onClose} realEstate={realEstate} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
