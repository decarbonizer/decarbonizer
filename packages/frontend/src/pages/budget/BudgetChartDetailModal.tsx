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
import PieDetailChart from './PieDetailChart';

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
        <ModalBody>
          <PieDetailChart
            investmentCosts={data.categoryInvestmentCostsThisYear}
            originalCosts={data.categoryOriginalConstantCost}
            profit={data.profit}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
