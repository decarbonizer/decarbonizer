import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Box,
  Button,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import { energySurvey } from '../../form-engine/energySurvey';
import FormEngine from '../../form-engine/FormEngine';
import { useGetAllBulbsQuery } from '../../store/api';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';

export default function SurveyContainer() {
  const schema = energySurvey;
  const [page, setPage] = useState(1);
  const [value, setValue] = useState({});
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const numQuestionsPerPage = schema.pages.map((x) => {
    return x.elements.length;
  });
  const numQuestions = numQuestionsPerPage.reduce((acc, curr) => {
    return acc + curr;
  });

  const answeredQuestions = Object.keys(value).length;
  const progress = (answeredQuestions * 100) / numQuestions;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const history = useHistory();

  function handleClick() {
    history.push('/');
  }

  if (isLoadingBulbs) {
    return <>Loading...</>;
  }

  return (
    <>
      <Center w="100%" h="100%">
        <Box w="100%" h="100%" maxH="70vh" maxW="70vw">
          <Flex justifyContent={'flex-end'}>
            <Button onClick={onOpen} size="sm">
              x
            </Button>
          </Flex>
          <Box mb="10">
            <Text>
              Questions answered: {answeredQuestions} of {numQuestions}
            </Text>
            <Progress value={progress} colorScheme="green" size="sm" />
          </Box>
          <Tabs>
            <TabList>
              <Tab>Survey</Tab>
              <Tab>Schema</Tab>
              <Tab>Value</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack align="flex-start">
                  <FormEngine
                    schema={schema}
                    choiceOptionProviders={{
                      bulbs: bulbs!.map((bulb) => ({ value: bulb._id, display: bulb.name })),
                    }}
                    page={page}
                    value={value}
                    onPageChanged={(e) => setPage(e.page)}
                    onValueChanged={(e) => setValue(e.value)}
                  />
                  <HStack
                    w="100%"
                    marginTop="4"
                    paddingTop="4"
                    justify="flex-end"
                    borderTopWidth="1px"
                    borderColor="gray">
                    <Text>Page:</Text>
                    <NumberInput
                      value={page}
                      min={1}
                      max={schema.pages.length}
                      onChange={(num) => setPage(isNaN(+num) ? 1 : +num)}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </VStack>
              </TabPanel>
              <TabPanel>
                <ReactJson src={schema} />
              </TabPanel>
              <TabPanel>
                <ReactJson src={value} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to to go back to the landing page? Your answers will not be saved.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleClick}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
