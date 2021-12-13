import {
  AccordionItem,
  AccordionPanel,
  Icon,
  IconButton,
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
import { MouseEvent, useContext, useEffect, useMemo } from 'react';
import { ActionPanelContext } from './actionPanelContext';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import range from 'lodash-es/range';
import isEmpty from 'lodash-es/isEmpty';
import ActionDetailsModal from './ActionDetailsModal';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';

export interface ActionAccordionItemProps {
  action: Action;
}

export function ActionAccordionItem({ action }: ActionAccordionItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { isLoading, providers } = useFormEngineChoiceOptionProviders(realEstateId);
  const schema = useMemo(() => {
    if (typeof action.getSchema === 'function') {
      const latestSurvey = surveyAnswers
        ?.slice()
        .reverse()
        .find((survey) => {
          return survey.surveyId === action.forSurvey;
        });
      return action.getSchema(latestSurvey);
    } else {
      return action.schema;
    }
  }, [action, surveyAnswers]);
  const { value, setValue, page, ruleEvaluationResults, validationErrors, handleValueChanged } = useFormEngine(schema);
  const isFilledOut = !isEmpty(value);
  const detailsModalDisclosure = useDisclosure();

  useFilledActionAnswerSync(action, value);

  const handleClearClick = (e: MouseEvent) => {
    setValue({});
    e.preventDefault();
  };

  const handleDetailsClick = (e: MouseEvent) => {
    detailsModalDisclosure.onOpen();
    e.preventDefault();
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
              onValueChanged={handleValueChanged}
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
function useFilledActionAnswerSync(action: Action, value: object) {
  const { filledActionAnswers, setFilledActionAnswers } = useContext(ActionPanelContext);

  useEffect(
    () => {
      const newActionAnswer: ActionAnswerBase | undefined = isEmpty(value)
        ? undefined
        : {
            actionId: action.id as KnownActionId,
            values: {
              value,
              detailsValue: undefined, // TODO: Populate from modal.
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
