import {
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Select,
  SkeletonText,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { GrClear } from 'react-icons/gr';
import { Action, KnownActionId } from '../../../data/actions/action';
import FormEngine from '../../../form-engine/FormEngine';
import { useFormEngine } from '../../../form-engine/useFormEngine';
import { useFormEngineChoiceOptionProviders } from '../../../form-engine/useFormEngineChoiceProviders';
import { Dispatch, MouseEvent, SetStateAction, useContext, useEffect, useState } from 'react';
import { DashboardContext, useFilledActionAnswersDataFrame } from '../dashboardContext';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import range from 'lodash-es/range';
import isEmpty from 'lodash-es/isEmpty';
import ActionDetailsModal from './ActionDetailsModal';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import { useActionSchema } from '../../../data/actions/useActionSchema';
import { useExternalCalculationData } from '../../../calculations/useExternalCalculationData';
import { useCalculation } from '../../../calculations/useCalculation';
import { getSuggestionForCost, getSuggestionForFootprint } from '../../../calculations/calculations/getSuggestion';
import SidePanelAccordionButton from '../../../components/SidePanelAccordionButton';
import { itCoreCalculations } from '../../../calculations/core/itCoreCalculations';

export interface ActionAccordionItemProps {
  action: Action;
}

export function ActionAccordionItem({ action }: ActionAccordionItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { isLoading, providers } = useFormEngineChoiceOptionProviders(realEstateId);
  const schema = useActionSchema(action, surveyAnswers);
  const [suggestion, setSuggestion] = useState<string>('');
  const { value, setValue, page, ruleEvaluationResults, validationErrors, handleValueChanged } = useFormEngine(schema);
  const isFilledOut = !isEmpty(value);
  const detailsModalDisclosure = useDisclosure();
  const { isLoading: dataLoading, data: externalData, error: externalDataError } = useExternalCalculationData();
  const { isOpen, onOpen, onClose } = useDisclosure(); //dialog for produced heating
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const {
    data,
    isLoading: calculationLoading,
    error,
  } = useCalculation(
    (externalCalculationData) => ({
      producedHeating: itCoreCalculations.getTotalYearlyProducedHeating(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    }),
    [filledActionAnswersDf],
  );

  useFilledActionAnswerSync(action, value, setValue);

  const handleClearClick = (e: MouseEvent) => {
    setSuggestion('');
    setValue({});
    e.preventDefault();
  };

  const handleDetailsClick = (e: MouseEvent) => {
    detailsModalDisclosure.onOpen();
    e.preventDefault();
  };

  const handleChange = (e: { value }) => {
    handleValueChanged(e);
    setSuggestion('');
    if ((action.id as KnownActionId) === 'useSuperServer') {
      if (e.value.newServer) {
        onOpen(); //open dialog only when action is selected
      }
    }
  };

  const handleSuggestionsClick = (e) => {
    if (externalData) {
      setSuggestion(e.target.value);
      if (e.target.value.length > 0) {
        const data =
          e.target.value == 'footprint'
            ? getSuggestionForFootprint(externalData, action.id as KnownActionId)
            : getSuggestionForCost(externalData, action.id as KnownActionId);
        if (data) {
          handleValueChanged({ value: data });
        }
      } else {
        setValue({});
      }
    }
  };

  return (
    <>
      <AccordionItem key={action.id} borderWidth="0 !important">
        <SidePanelAccordionButton
          px="2"
          title={action.name}
          icon={<Icon as={action.icon} />}
          badge={isFilledOut ? <Text>✅</Text> : ''}
          buttons={
            <>
              <Tooltip hasArrow label="Clear">
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Clear"
                  icon={<Icon as={GrClear} />}
                  onClick={handleClearClick}
                  isDisabled={!isFilledOut}
                />
              </Tooltip>
              <Tooltip hasArrow label="Additional Options...">
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Additional Options..."
                  icon={<Icon as={FaCog} />}
                  onClick={handleDetailsClick}
                  isDisabled={!isFilledOut}
                />
              </Tooltip>
            </>
          }
        />
        <AccordionPanel display="flex" flexDir="column">
          <Text layerStyle="hint" pb="4">
            {action.description}
          </Text>
          {isLoading ? (
            range(3).map((i) => <SkeletonText key={i} mb="2" />)
          ) : (
            <>
              {action.suggestionExists && (
                <Select
                  w="80"
                  bg="white"
                  p={2}
                  placeholder="Get recommendation for lowest..."
                  value={suggestion}
                  onChange={(e) => handleSuggestionsClick(e)}>
                  <option value="footprint">footrpint</option>
                  <option value="cost">cost</option>
                </Select>
              )}

              <FormEngine
                schema={schema}
                value={value}
                page={page}
                choiceOptionProviders={providers}
                ruleEvaluationResults={ruleEvaluationResults}
                validationErrors={validationErrors}
                onValueChanged={handleChange}
              />
              {action.suggestionExists &&
                suggestion.length > 0 &&
                (suggestion === 'cost' ? (
                  <Text layerStyle="hint" pb="4" p="4" color="green">
                    Current choice is the best option for reducing cost as its energy costs are the lowest.
                  </Text>
                ) : (
                  <Text layerStyle="hint" pb="4" p="4" color="green">
                    Current choice is the best option for reducing footprint as it produces the least kg/Co2 per kWh.
                  </Text>
                ))}
            </>
          )}
          {action.id === 'useSuperServer' ? (
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={undefined}
              onClose={onClose}
              isOpen={isOpen}
              isCentered>
              <AlertDialogOverlay />

              <AlertDialogContent>
                <AlertDialogHeader>Extra heating produced!</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  This action produces extra heating in form of <b>{data?.producedHeating.toFixed(2)}kWh</b>. It has
                  affected your heating action as some amount of required heating is compensated by using Cloud and Heat
                  technology.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="green" ml={3} onClick={onClose}>
                    OK
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <></>
          )}
        </AccordionPanel>
      </AccordionItem>
      {detailsModalDisclosure.isOpen && (
        <ActionDetailsModal isOpen action={action} onClose={detailsModalDisclosure.onClose} />
      )}
    </>
  );
}

/**
 * Whenever the user fills the action's form with valid data (i.e. data that's non-empty),
 * synchronizes that filled data with the page-global React context which holds the currently
 * filled out action answers.
 * Clears the value when the user clears the accordion.
 */
function useFilledActionAnswerSync(action: Action, value: object, setValue: Dispatch<SetStateAction<object>>) {
  const { actionPlanToEdit, filledActionAnswers, setFilledActionAnswers } = useContext(DashboardContext);

  useEffect(() => {
    if (actionPlanToEdit) {
      setValue(
        actionPlanToEdit.actionAnswers.find((actionAnswer) => actionAnswer.actionId === action.id)?.values.value ?? {},
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionPlanToEdit]);

  useEffect(
    () => {
      const newActionAnswer: ActionAnswerBase | undefined = isEmpty(value)
        ? undefined
        : {
            actionId: action.id as KnownActionId,
            values: {
              value,
              detailsValue: filledActionAnswers[action.id]?.values.detailsValue,
            },
          };

      setFilledActionAnswers({
        ...filledActionAnswers,
        [action.id]: newActionAnswer,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action, value],
  );
}
