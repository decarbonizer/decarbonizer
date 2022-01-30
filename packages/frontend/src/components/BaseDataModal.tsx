import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import FormEngine from '../form-engine/FormEngine';
import { useFormEngine } from '../form-engine/useFormEngine';
import { RealEstatePageParams } from '../routes';
import { useGetBaseDataForRealEstateQuery, useUpdateBaseDataMutation } from '../store/api';
import { useEffect } from 'react';
import { FormSchema } from '../form-engine/formSchema';

export const baseDataSchema: FormSchema = {
  pages: [
    {
      name: 'Base Data',
      elements: [
        {
          id: 'salaryElectricianMaintenanceWorkerPerHour',
          required: false,
          type: 'number',
          unit: '€/h',
          label: 'Salary of your electrician maintenance worker.',
        },
        {
          id: 'timeToChangeOneBulb',
          required: false,
          type: 'number',
          unit: 'min/Stk',
          label: 'Bulb replacing time',
          helperText: 'Time which is needed to change one bulb.',
        },
        {
          id: 'heatingKwHPerQm',
          required: false,
          type: 'number',
          unit: 'kwh/m²',
          label: 'Heating costs.',
        },
        {
          id: 'salaryItMaintenanceWorkerPerHour',
          required: false,
          type: 'number',
          unit: '€/h',
          label: 'Salary of your IT maintenance worker.',
        },
        {
          id: 'superServerCost',
          required: false,
          type: 'number',
          unit: '€/Stk',
          label: 'Super server costs.',
        },
        {
          id: 'normalServerCost',
          required: false,
          type: 'number',
          unit: '€/Stk',
          label: 'Server costs.',
        },
        {
          id: 'serverMaintenanceTime',
          required: false,
          type: 'number',
          unit: 'h/Stk',
          label: 'Sever maintenance time.',
          helperText: 'Time which is needed to maintain one server.',
        },
        {
          id: 'serverLifeTime',
          required: false,
          type: 'number',
          unit: 'years',
          label: 'Server lifetime.',
        },
        {
          id: 'footPrintServer',
          required: false,
          type: 'number',
          unit: 'kg/year',
          label: 'CO² of a server.',
        },
        {
          id: 'reductionFactorByUsingSuperServer',
          required: false,
          type: 'number',
          label: 'Reduction factor by using a super server.',
        },
        {
          id: 'shortTravelEF',
          required: false,
          type: 'number',
          label: 'Emission factor for short travel flights.',
          helperText: 'EF is needed for the calculation of the footprint.',
        },
        {
          id: 'longTravelEF',
          required: false,
          type: 'number',
          label: 'Emission factor for long travel flights.',
          helperText: 'EF is needed for the calculation of the footprint.',
        },
        {
          id: 'illuminationEF',
          required: false,
          type: 'number',
          label: 'Emission factor for illumination.',
          helperText: 'EF is needed for the calculation of the footprint.',
        },
      ],
    },
  ],
};

export interface BaseDataModalProps {
  isOpen: boolean;
  onClose(): void;
}

export default function BaseDataModal({ isOpen, onClose }: BaseDataModalProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const initialBaseData = useGetBaseDataForRealEstateQuery({ realEstateId });
  const { value, page, ruleEvaluationResults, validationErrors, handleValueChanged, setValue } = useFormEngine(
    baseDataSchema,
    initialBaseData.data,
  );
  const [updateBaseData] = useUpdateBaseDataMutation();
  const toast = useToast();

  useEffect(() => {
    if (initialBaseData.data) {
      setValue(initialBaseData.data);
    }
  }, [initialBaseData, setValue]);

  const handleUpdate = async () => {
    console.log(value);
    await updateBaseData({ realEstateId: realEstateId, body: value as any });
    onClose();
    toast({
      title: 'Base data updated.',
      description: 'Base data has been successfully updated.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Base Data Overview</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <FormEngine
            schema={baseDataSchema}
            value={value}
            page={page}
            ruleEvaluationResults={ruleEvaluationResults}
            validationErrors={validationErrors}
            onValueChanged={handleValueChanged}
          />
        </ModalBody>
        <ModalFooter>
          <Button width="40" right="6" colorScheme="green" onClick={handleUpdate}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
