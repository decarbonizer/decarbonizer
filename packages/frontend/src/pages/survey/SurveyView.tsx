import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Spacer,
  useDisclosure,
  Center,
  Spinner,
  Image,
  Flex,
  AspectRatio,
  Text,
} from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward, IoIosCheckmark } from 'react-icons/io';
import CancelSurveyConfirmationAlert from './CancelSurveyConfirmationAlert';
import SurveyProgressBar from './SurveyProgressBar';
import { useSurveyChoiceOptionProviders } from './useSurveyChoiceOptionProviders';
import { useGetSurveyQuery } from '../../store/api';
import { useFormEngine } from '../../form-engine/useFormEngine';
import FormEngine from '../../form-engine/FormEngine';
import { surveyImageSources } from './surveyData';

export interface SurveyDrawerProps {
  surveyId: string;
  onDone(): void;
}

export default function SurveyView({ surveyId, onDone }: SurveyDrawerProps) {
  const { data: survey, isLoading: isLoadingSurvey } = useGetSurveyQuery({ id: surveyId });
  const { providers, isLoading: isLoadingProviders } = useSurveyChoiceOptionProviders();
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
  } = useFormEngine(survey?.schema);
  const cancelSurveyDisclosure = useDisclosure();
  const isLoading = isLoadingSurvey || isLoadingProviders;

  const cancelSurvey = () => {
    cancelSurveyDisclosure.onClose();
    onDone();
  };

  const submitSurvey = () => {
    if (verifySubmit()) {
      // TODO: Finalize survey.
      onDone();
    }
  };

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex h="100%">
      <Flex
        as="aside"
        flexDir="column"
        w="xs"
        h="100%"
        mr="8"
        p="8"
        borderRight="1px"
        borderColor="gray.100"
        shadow="xl">
        <Heading as="h2" size="lg" mb="4">
          {survey!.name}
        </Heading>
        <AspectRatio maxW="100%" ratio={4 / 2.5}>
          <Image src={surveyImageSources[survey!._id]} alt="Survey Image" objectFit="cover" shadow="md" />
        </AspectRatio>
        <Text fontSize="sm" color="gray.500" mt="4">
          {survey!.description ?? 'No description available.'}
        </Text>
        <Spacer />
        <SurveyProgressBar schema={survey!.schema} value={value} />
        <Button colorScheme="red" variant="outline" mt="4" onClick={cancelSurveyDisclosure.onOpen}>
          Cancel
        </Button>
      </Flex>
      <Flex as="section" flexDir="column" flexGrow={1} p="8" pr="0">
        <Box overflowY="auto" w="100%" h="100%">
          <Box maxW="xl">
            <FormEngine
              schema={survey!.schema}
              choiceOptionProviders={providers}
              value={value}
              page={page}
              ruleEvaluationResults={ruleEvaluationResults}
              validationErrors={validationErrors}
              onValueChanged={handleValueChanged}
            />
          </Box>
        </Box>
        <HStack w="100%" pt="8">
          <Button
            minW="32"
            colorScheme="primary"
            variant="outline"
            leftIcon={<Icon as={IoIosArrowBack} />}
            isDisabled={!canGoToPrevious}
            onClick={goToPrevious}>
            Previous
          </Button>
          {canGoToNext ? (
            <Button minW="32" colorScheme="primary" rightIcon={<Icon as={IoIosArrowForward} />} onClick={goToNext}>
              Next
            </Button>
          ) : (
            <Button minW="32" colorScheme="primary" leftIcon={<Icon as={IoIosCheckmark} />} onClick={submitSurvey}>
              Submit
            </Button>
          )}
        </HStack>
      </Flex>
      <CancelSurveyConfirmationAlert
        isOpen={cancelSurveyDisclosure.isOpen}
        onCancel={cancelSurveyDisclosure.onClose}
        onConfirm={cancelSurvey}
      />
    </Flex>
  );
}
