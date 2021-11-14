import { Text, Progress } from '@chakra-ui/react';
import { FormSchema } from '../../form-engine/formSchema';
import { FormEngineValue } from '../../form-engine/types';
import sum from 'lodash-es/sum';

export interface SurveyProgressBarProps {
  schema: FormSchema;
  value: FormEngineValue;
}

export default function SurveyProgressBar({ schema, value }: SurveyProgressBarProps) {
  const numQuestionsPerPage = schema.pages.map((x) => x.elements.length);
  const numQuestions = sum(numQuestionsPerPage);
  const numAnsweredQuestions = Object.keys(value).length;
  const progress = (numAnsweredQuestions * 100) / numQuestions;

  return (
    <>
      <Text>
        Questions answered: {numAnsweredQuestions} of {numQuestions}
      </Text>
      <Progress value={progress} colorScheme="green" size="sm" />
    </>
  );
}
