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
import PieFootprintDetailChart from './PieFootprintDetailChart';

export interface BudgetChartDetailModalProps {
  isOpen: boolean;
  onClose(): void;
  data: BudgetChartDataEntry;
  mode: string;
}

export default function BudgetChartDetailModal({ isOpen, onClose, data, mode }: BudgetChartDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Year {data.year} details</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          {mode === 'cost' ? (
            <PieBudgetDetailChart
              investmentCosts={data.categoryInvestmentCostsThisYear}
              originalCosts={data.categoryOriginalConstantCost}
            />
          ) : (
            <PieFootprintDetailChart
              categoriesFootprint={data.categoryFootprintThisYear}
              originalFootprint={data.originalFootprint}
            />
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
