import { AccordionItem, AccordionPanel, Icon, Text, IconButton, Tooltip, SkeletonText } from '@chakra-ui/react';
import range from 'lodash-es/range';
import { FaCog } from 'react-icons/fa';
import { GrClear } from 'react-icons/gr';
import { Action } from '../../data/actions/action';
import FormEngine from '../../form-engine/FormEngine';
import { useFormEngine } from '../../form-engine/useFormEngine';
import { useFormEngineChoiceOptionProviders } from '../../form-engine/useFormEngineChoiceProviders';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { MouseEvent } from 'react';

export interface ActionAccordionItemProps {
  action: Action;
}

export function ActionAccordionItem({ action }: ActionAccordionItemProps) {
  const { isLoading, providers } = useFormEngineChoiceOptionProviders();
  const { value, setValue, page, ruleEvaluationResults, validationErrors, handleValueChanged } = useFormEngine(
    action.inlineSchema,
  );

  const handleClearClick = (e: MouseEvent) => {
    setValue({});
    e.preventDefault();
  };

  const handleDetailsClick = (e: MouseEvent) => {
    alert('Todo.');
  };

  return (
    <AccordionItem key={action.id}>
      <ActionPanelAccordionButton
        title={action.name}
        icon={<Icon as={action.icon} />}
        buttons={
          <>
            <Tooltip hasArrow label="Clear">
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Clear"
                icon={<Icon as={GrClear} />}
                onClick={handleClearClick}
              />
            </Tooltip>
            <Tooltip hasArrow label="Additional Options...">
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Additional Options..."
                icon={<Icon as={FaCog} />}
                onClick={handleDetailsClick}
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
            schema={action.inlineSchema}
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
  );
}
