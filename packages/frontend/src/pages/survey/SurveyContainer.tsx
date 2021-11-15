import {
  Center,
  VStack,
  HStack,
  Box,
  Button,
  useDisclosure,
  Spacer,
  Icon,
  Heading,
} from '@chakra-ui/react';
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
          <Center p="4">
        <Heading as="h2" size="lg" color="gray.600">
           {energySurvey.title}
          </Heading>
          </Center>
          <Box mb="10">
            <SurveyProgressBar schema={schema} value={value} />
          </Box>
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
          <HStack w="100%" paddingTop="4">
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
