import { Flex, Text, Heading, Spinner, Center } from '@chakra-ui/react';
import { Action } from '../../data/actions/action';
import FormEngine from '../../form-engine/FormEngine';
import { useFormEngine } from '../../form-engine/useFormEngine';
import { useFormEngineChoiceOptionProviders } from '../../form-engine/useFormEngineChoiceProviders';

export interface InlineActionViewProps {
  action: Action;
}

export default function InlineActionView({ action }: InlineActionViewProps) {
  const { isLoading, providers } = useFormEngineChoiceOptionProviders();
  const { value, page, ruleEvaluationResults, validationErrors, handleValueChanged } = useFormEngine(
    action.inlineSchema,
  );

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex flexDir="column">
      <FormEngine
        schema={action.inlineSchema}
        value={value}
        page={page}
        choiceOptionProviders={providers}
        ruleEvaluationResults={ruleEvaluationResults}
        validationErrors={validationErrors}
        onValueChanged={handleValueChanged}
      />
    </Flex>
  );
}
