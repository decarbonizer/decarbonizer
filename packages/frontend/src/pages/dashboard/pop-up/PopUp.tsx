import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export default function PopUp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add some details</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Grid templateColumns="repeat(5, 1fr)" gap={4} paddingTop={4}>
              <GridItem colSpan={2}>
                <Button onClick={onClose} width="40" colorScheme="gray">
                  Cancel
                </Button>
              </GridItem>
              <GridItem colStart={4} colEnd={6}>
                <Button
                  // onClick={""}
                  // isDisabled={""}
                  // isLoading={""}
                  position="absolute"
                  width="40"
                  right="6"
                  colorScheme="green">
                  Save
                </Button>
              </GridItem>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
