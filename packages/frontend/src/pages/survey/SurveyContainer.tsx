import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  HStack,
  Box,
  Button,
  useDisclosure,
  Spacer,
  Icon,
} from '@chakra-ui/react';
import ReactJson from 'react-json-view';
import { energySurvey } from './energySurvey';
import FormEngine from '../../form-engine/FormEngine';
import { useHistory } from 'react-router';
import { useFormEngine } from '../../form-engine/useFormEngine';
import CancelSurveyConfirmationAlert from './CancelSurveyConfirmationAlert';
import { IoIosArrowBack, IoIosArrowForward, IoIosCheckmark } from 'react-icons/io';
import SurveyProgressBar from './SurveyProgressBar';
import { useSurveyChoiceOptionProviders } from './useSurveyChoiceOptionProviders';

export default function SurveyContainer() {
  const history = useHistory();
  const schema = energySurvey;
  const { isLoading, providers } = useSurveyChoiceOptionProviders();
  const {
    value,
    page,
    ruleEvaluationResults,
    validationErrors,
    canGoToNext,
    canGoToPrevious,
    goToPrevious,
    goToNext,
    verifySubmit,
    handleValueChanged,
  } = useFormEngine(schema);
  const cancelSurveyDisclosure = useDisclosure();

  const cancelSurvey = () => {
    cancelSurveyDisclosure.onClose();
    history.push('/');
  };

  const submitSurvey = () => {
    if (verifySubmit()) {
      alert('Form submitted!');
      history.push('/');
    }
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <Center w="100%" h="100%">
        <Box w="100%" h="100%" maxH="70vh" maxW="70vw">
          <Box mb="10">
            <SurveyProgressBar schema={schema} value={value} />
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
                    choiceOptionProviders={providers}
                    value={value}
                    page={page}
                    ruleEvaluationResults={ruleEvaluationResults}
                    validationErrors={validationErrors}
                    onValueChanged={handleValueChanged}
                  />
                </VStack>
              </TabPanel>
              <TabPanel>
                <ReactJson src={schema} />
              </TabPanel>
              <TabPanel>
                <ReactJson src={{ value, ruleEvaluationResults, validationErrors }} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <HStack w="100%">
            <Button colorScheme="red" variant="outline" onClick={cancelSurveyDisclosure.onOpen} size="sm">
              Cancel
            </Button>
            <Spacer />
            <Button
              variant="outline"
              leftIcon={<Icon as={IoIosArrowBack} />}
              isDisabled={!canGoToPrevious}
              onClick={goToPrevious}>
              Previous
            </Button>
            {canGoToNext ? (
              <Button rightIcon={<Icon as={IoIosArrowForward} />} onClick={goToNext}>
                Next
              </Button>
            ) : (
              <Button colorScheme="primary" leftIcon={<Icon as={IoIosCheckmark} />} onClick={submitSurvey}>
                Submit
              </Button>
            )}
          </HStack>
        </Box>
      </Center>
      <CancelSurveyConfirmationAlert
        isOpen={cancelSurveyDisclosure.isOpen}
        onCancel={cancelSurveyDisclosure.onClose}
        onConfirm={cancelSurvey}
      />
    </>
  );
}
