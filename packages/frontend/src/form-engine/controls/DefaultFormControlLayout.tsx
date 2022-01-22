import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';
import { FormSchemaElement } from '../formSchema';
import { useValidationErrorsForElement } from '../internals/hooks';
import { Text, View, Image } from '@react-pdf/renderer';

import checkmark from '../../img/checkmark.png';

export interface DefaultFormControlLayoutProps {
  element: FormSchemaElement;
  children?: ReactNode;
}

export default function DefaultFormControlLayout({ element, children }: DefaultFormControlLayoutProps) {
  const validationErrors = useValidationErrorsForElement(element);
  const { isPdfView, isViewOnly } = useContext(FormEnginePropsContext);

  if (isPdfView) {
    const label = element.label ? (
      <Text>
        {element.label}
        {element.label.endsWith(':') || element.label.endsWith('?') ? '' : ':'}{' '}
      </Text>
    ) : null;

    return (
      <View
        style={{
          marginVertical: 3,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        {element.label ? (
          <View
            style={{
              flex: 1,
            }}>
            {label}
          </View>
        ) : null}
        <View style={{ flexGrow: 0, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
          {element.label ? null : <Image src={checkmark} style={{ width: 16, height: 16, marginRight: 5 }} />}
          <Text>{children}</Text>
        </View>
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
