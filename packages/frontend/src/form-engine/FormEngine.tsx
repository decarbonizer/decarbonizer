import { Code } from '@chakra-ui/react';
import { FormSchema } from './formSchema';

export interface FormEngineProps {
  schema: FormSchema;
  currentValue: object;
  currentPage: number;
  onCurrentValueChanged(e: { currentValue: object });
  onCurrentPageChanged(e: { currentPage: number });
}

export default function FormEngine(props: FormEngineProps) {
  return <Code>TODO: Implement FormEngine.tsx</Code>;
}
