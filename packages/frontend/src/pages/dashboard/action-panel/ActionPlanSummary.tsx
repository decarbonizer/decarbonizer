import { Accordion, AccordionItem, AccordionPanel, Icon, Grid } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { knownActionCategories, knownActions } from '../../../data/actions/action';
import FormEngine from '../../../form-engine/FormEngine';
import { useFormEngineChoiceOptionProviders } from '../../../form-engine/useFormEngineChoiceProviders';
import { RealEstatePageParams } from '../../../routes';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';

export interface ActionPlanSummaryProps {
  actionAnswers: Array<ActionAnswerBase>;
}

export function ActionPlanSummary({ actionAnswers }: ActionPlanSummaryProps) {
  console.log(actionAnswers);
  return (
    <Accordion allowToggle>
      {actionAnswers.map((actionAnswer) => (
        <ActionAnswerAccordionItem
          key={actionAnswer.actionId}
          actionId={actionAnswer.actionId}
          actionAnswer={actionAnswer}
        />
      ))}
    </Accordion>
  );
}

interface ActionAnswerAccordionItemProps {
  actionId: string;
  actionAnswer: ActionAnswerBase;
}

function ActionAnswerAccordionItem({ actionId, actionAnswer }: ActionAnswerAccordionItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { providers } = useFormEngineChoiceOptionProviders(realEstateId);
  const currentAction = knownActions.find((action) => actionId === action.id);
  const actionCategory = knownActionCategories.find((category) =>
    category.actions.some((action) => action === currentAction),
  );

  return (
    <AccordionItem>
      <ActionPanelAccordionButton
        title={`${actionCategory?.name}: ${currentAction?.name}` ?? actionId}
        icon={<Icon as={currentAction?.icon} />}
      />
      <AccordionPanel>
        <Grid templateColumns="repeat(2,1fr)" w="100%" align="flex-start">
          <FormEngine
            value={actionAnswer.values.value}
            isViewOnly
            schema={currentAction?.schema ?? { pages: [] }}
            page={1}
            choiceOptionProviders={providers}
            ruleEvaluationResults={{}}
            validationErrors={{}}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onValueChanged={() => {}}
          />
          {actionAnswer.values.detailsValue && (
            <FormEngine
              value={actionAnswer.values.detailsValue}
              isViewOnly
              schema={currentAction?.detailsSchema ?? { pages: [] }}
              page={1}
              choiceOptionProviders={providers}
              ruleEvaluationResults={{}}
              validationErrors={{}}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onValueChanged={() => {}}
            />
          )}
        </Grid>
      </AccordionPanel>
      {/* <AccordionPanel></AccordionPanel> */}
    </AccordionItem>
  );
}
