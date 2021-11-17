import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Spacer,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward, IoIosCheckmark } from 'react-icons/io';
import { useHistory } from 'react-router';
import { routes } from '../../constants';
import FormEngine from '../../form-engine/FormEngine';
import { useFormEngine } from '../../form-engine/useFormEngine';
import CancelSurveyConfirmationAlert from './CancelSurveyConfirmationAlert';
import { energySurvey } from './energySurvey';
import SurveyProgressBar from './SurveyProgressBar';
import { useSurveyChoiceOptionProviders } from './useSurveyChoiceOptionProviders';

export interface SurveyDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export default function SurveyDrawer({ isOpen, onClose }: SurveyDrawerProps) {
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
    onClose();
  };

  const submitSurvey = () => {
    if (verifySubmit()) {
      history.push(routes.realEstateDashboard());
      onClose();
    }
  };

  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <Drawer size="full" placement="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader fontSize="md" fontWeight="normal">
          <Heading as="h2" size="lg" mb="4">
            Illumination Survey
          </Heading>
          <SurveyProgressBar schema={schema} value={value} />
        </DrawerHeader>
        <DrawerBody mt="4">
          <Box maxW="lg">
            <FormEngine
              schema={schema}
              choiceOptionProviders={providers}
              value={value}
              page={page}
              ruleEvaluationResults={ruleEvaluationResults}
              validationErrors={validationErrors}
              onValueChanged={handleValueChanged}
            />
          </Box>
          <HStack w="100%" paddingTop="8">
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
          <CancelSurveyConfirmationAlert
            isOpen={cancelSurveyDisclosure.isOpen}
            onCancel={cancelSurveyDisclosure.onClose}
            onConfirm={cancelSurvey}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
