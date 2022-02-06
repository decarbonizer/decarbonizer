import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ActionPlan } from '../../api/actionPlan';
import BudgetTable from './BudgetTable';

export interface BudgetTableModalProps {
  isOpen: boolean;
  onClose(): void;
  actionPlan: ActionPlan;
}

export default function BudgetTableModal({ isOpen, onClose, actionPlan }: BudgetTableModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Summary Table: {actionPlan.name}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <BudgetTable actionPlan={actionPlan} />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
