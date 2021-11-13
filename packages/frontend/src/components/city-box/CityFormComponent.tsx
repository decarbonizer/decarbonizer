import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Grid, GridItem } from '@chakra-ui/layout';
import {
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/textarea';
import React from 'react';
import { useCreateRealEstateMutation } from '../../store/api';

interface CityFormComponentProps {
  onClose: () => void;
}

export default function CityFormComponent({ onClose }: CityFormComponentProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [employees, setEmployees] = React.useState(1);
  const [area, setArea] = React.useState(1);

  const [addRealEstate, { isLoading: isAdding }] = useCreateRealEstateMutation();

  const addNewRealEstate = async () => {
    await addRealEstate({ cityName: name, description: description, employees: employees, area: area });
    onClose();
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChangeEmployees = (value) => {
    const intValue: number = +value;
    setEmployees(intValue);
  };

  const onChangeArea = (value) => {
    const intValue: number = +value;
    setArea(intValue);
  };

  return (
    <Box>
      <Box>
        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input placeholder="e.g Stuttgart" type="text" value={name} onChange={onChangeName} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="e.g Big building with a small park inside"
            value={description}
            onChange={onChangeDescription}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Number of employees</FormLabel>
          <NumberInput step={1} value={employees} onChange={onChangeEmployees} min={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            Area in m<sup>2</sup>
          </FormLabel>
          <NumberInput step={1} value={area} onChange={onChangeArea} min={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Box>
      <Grid templateColumns="repeat(5, 1fr)" gap={4} paddingTop={4}>
        <GridItem colSpan={2}>
          <Button onClick={onClose} width="40" colorScheme="gray">
            Cancel
          </Button>
        </GridItem>
        <GridItem colStart={4} colEnd={6}>
          <Button
            onClick={addNewRealEstate}
            isDisabled={name.length < 2}
            isLoading={isAdding}
            position="absolute"
            width="40"
            right="6"
            colorScheme="green">
            Save
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}
