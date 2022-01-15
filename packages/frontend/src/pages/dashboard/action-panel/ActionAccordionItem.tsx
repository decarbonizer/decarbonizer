import {
  AccordionItem,
  AccordionPanel,
  Icon,
  IconButton,
  Radio,
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
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { Dispatch, MouseEvent, SetStateAction, useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../dashboardContext';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import range from 'lodash-es/range';
import isEmpty from 'lodash-es/isEmpty';
import ActionDetailsModal from './ActionDetailsModal';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import { useActionSchema } from '../../../data/actions/useActionSchema';
import { useExternalCalculationData } from '../../../calculations/externalData';
import { getSuggestion } from '../../../calculations/getSuggestion';

export interface ActionAccordionItemProps {
  action: Action;
}

export function ActionAccordionItem({ action }: ActionAccordionItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { isLoading, providers } = useFormEngineChoiceOptionProviders(realEstateId);
  const schema = useActionSchema(action, surveyAnswers);
  const [isBestOption, setIsBestOption] = useState(false);
  const { value, setValue, page, ruleEvaluationResults, validationErrors, handleValueChanged } = useFormEngine(schema);
  const isFilledOut = !isEmpty(value);
  const detailsModalDisclosure = useDisclosure();
  const { isLoading: dataLoading, data: externalData, error: externalDatatError } = useExternalCalculationData();

  useFilledActionAnswerSync(action, value, setValue);

  const handleClearClick = (e: MouseEvent) => {
    setValue({});
    setIsBestOption(false);
    e.preventDefault();
  };

  const handleDetailsClick = (e: MouseEvent) => {
    detailsModalDisclosure.onOpen();
    e.preventDefault();
  };

  const handleChange = (e: { value }) => {
    handleValueChanged(e);
    setIsBestOption(false);
  };

  const handleSuggestionsClick = (e: MouseEvent) => {
    if (externalData) {
      const data = getSuggestion(externalData, action.id as KnownActionId);
      if (data) {
        handleValueChanged({ value: data });
        setIsBestOption(true);
      }
    }
  };

  return (
    <>
      <AccordionItem key={action.id} borderWidth="0 !important">
        <ActionPanelAccordionButton
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
        {action.suggestionExists && (
          <Radio colorScheme="green" onClick={handleSuggestionsClick} name="suggestion" isChecked={isBestOption}>
            Suggest best action{' '}
          </Radio>
        )}
        <AccordionPanel display="flex" flexDir="column">
          <Text layerStyle="hint" pb="4">
            {action.description}
          </Text>
          {isLoading ? (
            range(3).map((i) => <SkeletonText key={i} mb="2" />)
          ) : (
            <FormEngine
              schema={schema}
              value={value}
              page={page}
              choiceOptionProviders={providers}
              ruleEvaluationResults={ruleEvaluationResults}
              validationErrors={validationErrors}
              onValueChanged={handleChange}
            />
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
