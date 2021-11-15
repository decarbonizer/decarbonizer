import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FormSchemaElement } from '../formSchema';
import { useValidationErrorsForElement } from '../internals/hooks';

export interface DefaultFormControlLayoutProps {
  element: FormSchemaElement;
  children?: ReactNode;
}

export default function DefaultFormControlLayout({ element, children }: DefaultFormControlLayoutProps) {
  const validationErrors = useValidationErrorsForElement(element);

  return (
    <FormControl isRequired={element.required} isInvalid={validationErrors.length > 0}>
      <FormLabel fontWeight="semibold">{element.label}</FormLabel>
      {children}
      {element.helperText && <FormHelperText>{element.helperText}</FormHelperText>}
      {validationErrors.map((error, index) => (
        <FormErrorMessage key={index}>{error}</FormErrorMessage>
      ))}
    </FormControl>
  );
}
