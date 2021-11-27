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
} from '@chakra-ui/react';
import FormEngine from '../../../form-engine/FormEngine';
import { FormSchema } from '../../../form-engine/formSchema';
import { useFormEngine } from '../../../form-engine/useFormEngine';

const schemaRunTime: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        {
          id: 'choosePriority',
          required: false,
          label: 'Choose priority',
          type: 'single-choice-select',
          options: '',
        },
        {
          id: 'inOut',
          required: false,
          label: 'Where, Inside or Outside?',
          type: 'single-choice-select',
          options: [{ value: 'inside' }, { value: 'outside' }],
        },
        { id: 'numberOfHours', required: false, label: 'By how many hours?', type: 'number' },
      ],
    },
  ],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schemaBrightnessSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        { id: 'choosePriority', required: false, label: 'Choose priority', type: 'single-choice-select', options: '' },
      ],
    },
  ],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schemaMotionSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        { id: 'choosePriority', required: false, label: 'Choose priority', type: 'single-choice-select', options: '' },
        { id: 'numberOfHours', required: false, label: 'How long the illuminant should be active?', type: 'number' },
      ],
    },
  ],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schemaTimeSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        { id: 'choosePriority', required: false, label: 'Choose priority', type: 'single-choice-select', options: '' },
        {
          id: 'chooseTimeOn',
          required: false,
          label: 'When the illuminants should be switched on?',
          type: 'date-time',
        },
        {
          id: 'chooseTimeOff',
          required: false,
          label: 'When the illuminants should be switched off?',
          type: 'date-time',
        },
      ],
    },
  ],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schemaSwitches: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        { id: 'choosePriority', required: false, label: 'Choose priority', type: 'single-choice-select', options: '' },
      ],
    },
  ],
};

export default function PopUp(props: { isOpen: boolean; onClose: () => void; schema: FormSchema }) {
  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged } =
    useFormEngine(schemaRunTime);

  const submitSurvey = () => {
    if (verifySubmit()) {
      console.log('submit');
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add some details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormEngine
              schema={props.schema}
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
                <Button onClick={props.onClose} width="40" colorScheme="gray">
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
