import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';
import { FormSchemaElement } from '../formSchema';
import { useValidationErrorsForElement } from '../internals/hooks';
import { Text, View } from '@react-pdf/renderer';

export interface DefaultFormControlLayoutProps {
  element: FormSchemaElement;
  children?: ReactNode;
}

export default function DefaultFormControlLayout({ element, children }: DefaultFormControlLayoutProps) {
  const validationErrors = useValidationErrorsForElement(element);
  const { isPdfView, isViewOnly } = useContext(FormEnginePropsContext);

  if (isPdfView) {
    return (
      <View
        style={{
          marginVertical: 3,
          flexDirection: 'row',
        }}>
        {element.label && (
          <Text>
            {element.label}
            {element.label.endsWith(':') ? '' : ':'}{' '}
          </Text>
        )}
        <Text>{children}</Text>
      </View>
    );
  }

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
