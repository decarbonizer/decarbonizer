import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { AspectRatio, Box, Center, Flex, Grid, GridItem, IconButton, Spacer } from '@chakra-ui/react';
import {
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Image,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/textarea';
import { useState } from 'react';
import { RealEstate } from '../../api/realEstate';
import { useCreateRealEstateMutation, useUpdateRealEstateMutation } from '../../store/api';
import FileBase from 'react-file-base64';
import { BiImage } from 'react-icons/bi';
import { RiDeleteBin5Fill } from 'react-icons/ri';

interface CreateRealEstateFormProps {
  onClose(): void;
  realEstate?: RealEstate;
}

export default function CreateRealEstateForm({ onClose, realEstate }: CreateRealEstateFormProps) {
  const [cityName, setCityName] = useState(realEstate?.cityName ?? '');
  const [description, setDescription] = useState(realEstate?.description ?? '');
  const [employees, setEmployees] = useState(realEstate?.employees ?? 1);
  const [area, setArea] = useState(realEstate?.area ?? 1);
  const [image, setImage] = useState(realEstate?.image ?? '');
  const [error, setError] = useState('');
  const [createRealEstate, { isLoading: isAdding }] = useCreateRealEstateMutation();
  const [updateRealEstate, { isLoading: isUpdatingRealEstate }] = useUpdateRealEstateMutation();

  const addNewRealEstate = async () => {
    try {
      if (realEstate) {
        await updateRealEstate({
          id: realEstate._id,
          body: { cityName: cityName, description: description, employees: employees, area: area, image: image },
        });
      } else {
        await createRealEstate({
          cityName: cityName,
          description: description,
          employees: employees,
          area: area,
          image: image,
        }).unwrap();
      }

      onClose();
    } catch (e) {
      setError('An error occured while creating a new real estate. Please check all fields and try again.');
    }
  };

  const onChangeName = (e) => {
    if (error !== '') {
      setError('');
    }

    setCityName(e.target.value);
  };

  const onChangeDescription = (e) => {
    if (error !== '') {
      setError('');
    }

    setDescription(e.target.value);
  };

  const onChangeEmployees = (value) => {
    if (error !== '') {
      setError('');
    }

    setEmployees(+value);
  };

  const onChangeArea = (value) => {
    if (error !== '') {
      setError('');
    }

    setArea(+value);
  };

  const onChangeImage = () => {
    setImage('');
  };

  const getBaseFile = (files) => {
    setImage(files.base64.toString());
  };

  return (
    <>
      <Box>
        <Flex>
          <Center>
            <Text>Upload picture</Text>
          </Center>
          <Spacer />
          <IconButton aria-label="Search database" icon={<RiDeleteBin5Fill color="red" />} onClick={onChangeImage} />
        </Flex>
        <AspectRatio maxW="100%" ratio={4 / 1.75} mt={4}>
          <Image src={image} fallback={<BiImage />} alt="City Image" objectFit="cover" roundedTop="md" />
        </AspectRatio>
        <Box mt={4}>
          <FileBase type="file" multiple={false} onDone={getBaseFile} />
        </Box>
        <FormControl isRequired mt={4}>
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
    </>
  );
}
