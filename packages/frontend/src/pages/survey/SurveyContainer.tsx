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
  Alert,
  AlertIcon,
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
import { evaluateEngineRuleForElement } from '../../form-engine/rules';

export default function SurveyContainer() {
  const schema = energySurvey;
  const [page, setPage] = useState(1);
  const [value, setValue] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const numQuestionsPerPage = schema.pages.map((x) => {
    return x.elements.length;
  });
  const numQuestions = numQuestionsPerPage.reduce((acc, curr) => {
    return acc + curr;
  });

  const numAnsweredQuestions = Object.keys(value).length;
  const progress = (numAnsweredQuestions * 100) / numQuestions;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const history = useHistory();

  const questionsOfCurrentPage = schema.pages[page - 1].elements;
  const requiredQuestionsOfCurrentPage = questionsOfCurrentPage.filter((question) => {
    const ruleEvaluationResult = evaluateEngineRuleForElement(question, value);
    return question.required && !ruleEvaluationResult.hide;
  });

  const error = requiredQuestionsOfCurrentPage.some((question) => {
    console.log(value[question.property]);
    return value[question.property] === undefined || value[question.property] === '';
  });

  console.log(error);

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
              Questions answered: {numAnsweredQuestions} of {numQuestions}
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
                  {showErrorMessage && error ? (
                    <Alert status="error">
                      <AlertIcon />
                      Please fill out all the required (*) questions.
                    </Alert>
                  ) : null}
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
          <Flex justifyContent={'space-between'}>
            {page == 1 ? (
              <div />
            ) : (
              <Button
                onClick={() => {
                  setPage(page - 1);
                  setShowErrorMessage(true);
                }}>
                Back
              </Button>
            )}

            {page == schema.pages.length ? (
              <Button
                colorScheme="green"
                onClick={() => {
                  if (error) {
                    setShowErrorMessage(true);
                  } else {
                    // TODO: Save in DB
                  }
                }}
                variant={error ? 'ghost' : 'solid'}>
                Submit
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (error) {
                    setShowErrorMessage(true);
                  } else {
                    setPage(page + 1);
                    setShowErrorMessage(false);
                  }
                }}
                variant={error ? 'ghost' : 'solid'}>
                Next
              </Button>
            )}
          </Flex>
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
