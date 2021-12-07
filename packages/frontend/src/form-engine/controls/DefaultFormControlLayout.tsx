import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';
import { FormSchemaElement } from '../formSchema';
import { useValidationErrorsForElement } from '../internals/hooks';

export interface DefaultFormControlLayoutProps {
  element: FormSchemaElement;
  children?: ReactNode;
}

export default function DefaultFormControlLayout({ element, children }: DefaultFormControlLayoutProps) {
  const validationErrors = useValidationErrorsForElement(element);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  return (
    <FormControl isRequired={element.required} isInvalid={validationErrors.length > 0}>
      {element.label && <FormLabel fontWeight="semibold">{element.label}</FormLabel>}
      {children}
      {!isViewOnly && element.helperText && <FormHelperText whiteSpace="pre-line">{element.helperText}</FormHelperText>}
      {validationErrors.map((error, index) => (
        <FormErrorMessage key={index}>{error}</FormErrorMessage>
      ))}
    </FormControl>
  );
}
