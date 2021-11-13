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

  function createCity(name: string, description: string, capacity: number, area: number) {
    throw new Error('Function not implemented.');
  }

  const props = {createCity, onClose};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new city</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CityFormComponent props={props}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}


