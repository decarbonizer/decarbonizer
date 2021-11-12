import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control';
import { ReactNode } from 'react';
import { FormSchemaElement } from '../formSchema';

export interface DefaultFormControlLayoutProps {
  element: FormSchemaElement;
  children?: ReactNode;
}

export default function DefaultFormControlLayout({ element, children }: DefaultFormControlLayoutProps) {
  return (
    <FormControl isRequired={element.required}>
      <FormLabel fontWeight="semibold">{element.label}</FormLabel>
      {children}
      {element.helperText && <FormHelperText>{element.helperText}</FormHelperText>}
    </FormControl>
  );
}
