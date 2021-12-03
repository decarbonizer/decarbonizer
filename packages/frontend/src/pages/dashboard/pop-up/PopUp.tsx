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
import { FormSchema, SingleChoiceSelectFormSchemaElement } from '../../../form-engine/formSchema';
import { useFormEngine } from '../../../form-engine/useFormEngine';
import { FormEngineValue } from '../../../form-engine/types';
import { useEffect } from 'react';

const priorityOptions: SingleChoiceSelectFormSchemaElement = {
  id: 'choosePriority',
  required: false,
  label: '📊 Choose priority',
  type: 'single-choice-select',
  options: [
    {
      value: 'high',
      display: 'High',
    },
    {
      value: 'medium',
      display: 'Medium',
    },
    {
      value: 'low',
      display: 'Low',
    },
  ],
};

const schemaLED: FormSchema = {
  pages: [
    {
      elements: [
        {
          id: 'chooseTimePeriod',
          required: false,
          label: '📆 Choose time period',
          type: 'dates',
        },
        priorityOptions,
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schemaRunTime: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        priorityOptions,
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
        priorityOptions,
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
        priorityOptions,
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
        priorityOptions,
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
        priorityOptions,
      ],
    },
  ],
};

export const popUpSchemas = {
  led: schemaLED,
  runtime: schemaRunTime,
  brightnessSensor: schemaBrightnessSensor,
  motionSensor: schemaMotionSensor,
  timeSensor: schemaTimeSensor,
  switches: schemaSwitches,
};

export type PopUpSchema = keyof typeof popUpSchemas;

export default function PopUp(props: {
  isOpen: boolean;
  onClose: (value?: FormEngineValue) => void;
  schema: PopUpSchema;
  initialValue?: FormEngineValue;
}) {
  const schema = popUpSchemas[props.schema];
  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged, setValue } =
    useFormEngine(schema, props.initialValue);

  useEffect(() => {
    if (props.isOpen) {
      setValue(props.initialValue ?? {});
    }
  }, [props.isOpen, props.initialValue, setValue]);

  const submitSurvey = () => {
    // TODO: recalculation if necessary
    if (verifySubmit()) {
      props.onClose(value);
    }
  };

  const handleClose = () => {
    props.onClose(props.initialValue);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add some details</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
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
              <Button onClick={handleClose} width="40" colorScheme="gray">
                Cancel
              </Button>
            </GridItem>
            <GridItem colStart={4} colEnd={6}>
              <Button onClick={submitSurvey} position="absolute" width="40" right="6" colorScheme="green">
                Apply
              </Button>
            </GridItem>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
