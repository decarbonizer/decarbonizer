import { Button, AspectRatio, Badge, VStack, Heading, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
import Card from '../../components/Card';
import { Survey } from '../../data/surveys/survey';
import { useGetAllSurveyAnswersForRealEstateAndSurveyQuery } from '../../store/api';
import { SurveyAnswerDrawer } from './SurveyAnswerDrawer';

export interface SurveyCardProps {
  survey: Survey;
  realEstateId: string;
  onNewClick?(): void;
  onViewAnswersClick?(): void;
}

export default function SurveyCard({ survey, realEstateId, onNewClick }: SurveyCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateAndSurveyQuery({
    realEstateId,
    surveyId: survey.id,
  });

  return (
    <Card pos="relative" display="flex" flexDir="column" w="80">
      <AspectRatio maxW="100%" ratio={4 / 2.5}>
        <Image src={survey.imageUrl} alt="Survey Image" objectFit="cover" roundedTop="md" />
      </AspectRatio>
      {(surveyAnswers?.length === 0 ?? true) && (
        <Badge colorScheme="yellow" pos="absolute" top="4" right="0" roundedRight="0" shadow="lg">
          Unanswered
        </Badge>
      )}
      {(surveyAnswers?.length ?? 0) > 0 && (
        <Badge colorScheme="green" pos="absolute" top="4" right="0" roundedRight="0" shadow="lg">
          Answered ({surveyAnswers!.length === 1 ? '1 time' : `${surveyAnswers!.length} times`})
        </Badge>
      )}
      <VStack flexDir="column" p="4">
        <Heading as="h4" size="sm" fontWeight="semibold">
          {survey.name}
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {survey.description ?? 'No description available.'}
        </Text>
        <HStack spacing="4" pt="4">
          <Button variant="ghost" size="sm" isDisabled={surveyAnswers?.length === 0 ?? true} onClick={onOpen}>
            Past Answers
          </Button>
          <SurveyAnswerDrawer isOpen={isOpen} onClose={onClose} surveyAnswers={surveyAnswers} />
          <Button size="sm" colorScheme="primary" onClick={onNewClick}>
            Answer
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}
