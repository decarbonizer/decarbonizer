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
import FormEngine from '../../../form-engine/FormEngine';
import { FormSchema } from '../../../form-engine/formSchema';
import { useFormEngine } from '../../../form-engine/useFormEngine';

const schema: FormSchema = { pages: [{ elements: [] }] };

export default function PopUp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged } =
    useFormEngine(schema);

  const submitSurvey = () => {
    if (verifySubmit()) {
      console.log('submit');
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add some details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormEngine
              schema={schema}
              value={value}
              page={page}
              ruleEvaluationResults={ruleEvaluationResults}
              validationErrors={validationErrors}
              onValueChanged={handleValueChanged}
            />
          </ModalBody>

          <ModalFooter>
            <Grid templateColumns="repeat(5, 1fr)" gap={4} paddingTop={4}>
              <GridItem colSpan={2}>
                <Button onClick={onClose} width="40" colorScheme="gray">
                  Cancel
                </Button>
              </GridItem>
              <GridItem colStart={4} colEnd={6}>
                <Button
                  onClick={submitSurvey}
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
