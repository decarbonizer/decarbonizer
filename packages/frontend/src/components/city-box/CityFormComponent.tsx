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
  Text,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/textarea';
import React from 'react';
import { useCreateRealEstateMutation } from '../../store/api';

interface CityFormComponentProps {
  onClose: () => void;
}

export default function CityFormComponent({ onClose }: CityFormComponentProps) {
  const [cityName, setCityName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [employees, setEmployees] = React.useState(1);
  const [area, setArea] = React.useState(1);
  const [error, setError] = React.useState('');

  const [addRealEstate, { isLoading: isAdding }] = useCreateRealEstateMutation();

  const addNewRealEstate = async () => {
    try {
      await addRealEstate({ cityName: cityName, description: description, employees: employees, area: area }).unwrap();
      onClose();
    } catch (e) {
      setError('An error occured while creating a new real estate. Please check all fields and try again');
    }
  };

  const onChangeName = (e) => {
    if (error != '') setError('');
    setCityName(e.target.value);
  };

  const onChangeDescription = (e) => {
    if (error != '') setError('');
    setDescription(e.target.value);
  };

  const onChangeEmployees = (value) => {
    if (error != '') setError('');
    const intValue: number = +value;
    setEmployees(intValue);
  };

  const onChangeArea = (value) => {
    if (error != '') setError('');
    const intValue: number = +value;
    setArea(intValue);
  };

  return (
    <Box>
      <Box>
        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input placeholder="e.g Stuttgart" type="text" value={cityName} onChange={onChangeName} />
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
        <Box>
          <Text fontSize="sm" color="red">
            {error}
          </Text>
        </Box>
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
            isDisabled={cityName.length < 2}
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
