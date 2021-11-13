import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import CityFormComponent from './CityFormComponent';

interface AddCityComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCityComponent({ isOpen, onClose }: AddCityComponentProps) {

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new city</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CityFormComponent onClose={onClose}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}


