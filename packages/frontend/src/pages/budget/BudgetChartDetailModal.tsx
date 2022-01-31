import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { BudgetChartDataEntry } from '../../calculations/calculations/getBudgetChartData';

export interface BudgetChartDetailModalProps {
  isOpen: boolean;
  onClose(): void;
  data: BudgetChartDataEntry;
}

export default function BudgetChartDetailModal({ isOpen, onClose, data }: BudgetChartDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Year {data.year} details</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody></ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
