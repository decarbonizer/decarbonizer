import { MultiChoiceFormSchemaElement } from '../formSchema';
import { Checkbox, CheckboxGroup, List, ListIcon, ListItem, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';
import { MdCheckCircle } from 'react-icons/md';

export default function MultiChoiceFormEngineControl({
  element,
}: FormEngineControlProps<MultiChoiceFormSchemaElement>) {
  const [value, setValue] = useValueProperty<Array<string> | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const options = useChoiceOptions(element.options);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return (
      <DefaultFormControlLayout element={element}>
        <List spacing={1}>
          {(value ?? options.map((option) => option.value)).map((value) => (
            <ListItem key={value}>
              <ListIcon as={MdCheckCircle} color="primary" />
              {options.find((option) => option.value === value)?.display ?? value}
            </ListItem>
          ))}
        </List>
      </DefaultFormControlLayout>
    );
  }

  return (
    <DefaultFormControlLayout element={element}>
      <CheckboxGroup
        isDisabled={ruleEvaluationResult.disable}
        value={value ?? options.map((option) => option.value)}
        onChange={(e) => setValue(e as any)}
        colorScheme="primary">
        <VStack spacing={2} align="flex-start" ml="4">
          {options.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.display ?? option.value}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </DefaultFormControlLayout>
  );
}
