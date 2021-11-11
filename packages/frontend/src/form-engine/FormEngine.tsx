import { FormSchema } from './formSchema';

export interface FormEngineProps {
  schema: FormSchema;
  currentValue: object;
  currentPage: number;
  onCurrentValueChanged(e: { currentValue: object });
  onCurrentPageChanged(e: { currentPage: number });
}

export default function FormEngine(props: FormEngineProps) {
  return <>{JSON.stringify(props.schema)}</>;
}
