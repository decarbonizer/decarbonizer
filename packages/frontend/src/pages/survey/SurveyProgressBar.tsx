import { Text, Progress, Flex, Icon, Box } from '@chakra-ui/react';
import { FormSchema } from '../../form-engine/formSchema';
import { FormEngineValue } from '../../form-engine/types';
import sum from 'lodash-es/sum';
import { BsCheckLg } from 'react-icons/bs';

export interface SurveyProgressBarProps {
  schema: FormSchema;
  value: FormEngineValue;
  page: number;
}

export default function SurveyProgressBar({ schema, value, page }: SurveyProgressBarProps) {
  const numQuestionsPerPage = schema.pages.map((x) => x.elements.length);
  const numQuestions = sum(numQuestionsPerPage);
  const numAnsweredQuestions = Object.keys(value).length;
  const progress = (numAnsweredQuestions * 100) / numQuestions;

  return (
    <Flex flexDir="column">
      <Text fontWeight="bold">
        Questions answered: {numAnsweredQuestions} of {numQuestions}
      </Text>
      <Progress value={progress} colorScheme="green" size="sm" my="2" />

      {schema.pages.map((schemaPage, index) => (
        <Box key={index}>
          <Text
            mt="3"
            alignSelf="flex-start"
            fontWeight="semibold"
            color={page === index + 1 ? 'green.500' : undefined}>
            <Icon as={BsCheckLg} color={index + 1 < page ? 'green' : 'transparent'} />
            &nbsp;{`${index + 1}. ${schemaPage.name}` ?? `Page ${index}`}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}
