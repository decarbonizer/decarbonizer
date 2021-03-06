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
import PieBudgetDetailChart from './PieBudgetDetailChart';

export interface BudgetChartDetailModalProps {
  isOpen: boolean;
  onClose(): void;
  data: BudgetChartDataEntry;
  mode: string;
}

export default function BudgetChartDetailModal({ isOpen, onClose, data }: BudgetChartDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Year {data.year} details</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <PieBudgetDetailChart
            investmentCosts={data.categoryInvestmentCostsThisYear}
            originalCosts={data.categoryOriginalConstantCost}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
