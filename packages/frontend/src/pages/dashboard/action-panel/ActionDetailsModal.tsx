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
import { useContext } from 'react';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { Action } from '../../../data/actions/action';
import FormEngine from '../../../form-engine/FormEngine';
import { useFormEngine } from '../../../form-engine/useFormEngine';
import { ActionPanelContext } from './actionPanelContext';

export interface ActionDetailsModalProps {
  action: Action;
  isOpen: boolean;
  onClose(): void;
}

export default function ActionDetailsModal({ action, isOpen, onClose }: ActionDetailsModalProps) {
  const { filledActionAnswers, setFilledActionAnswers } = useContext(ActionPanelContext);
  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged } = useFormEngine(
    action.detailsSchema!,
    filledActionAnswers[action.id].values.detailsValue,
  );

  const handleApplyClick = () => {
    if (verifySubmit()) {
      const newActionAnswer: ActionAnswerBase = {
        ...filledActionAnswers[action.id],
        values: {
          value: filledActionAnswers[action.id],
          detailsValue: value,
        },
      };

      setFilledActionAnswers({
        ...filledActionAnswers,
        [action.id]: newActionAnswer,
      });

      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Refine your action</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <FormEngine
            schema={action.detailsSchema!}
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
              <Button onClick={handleApplyClick} position="absolute" width="40" right="6" colorScheme="green">
                Apply
              </Button>
            </GridItem>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
