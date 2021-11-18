import { Box, Button, Flex, AspectRatio, Badge, VStack, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { Survey } from '../../api/survey';
import { surveyImageSources } from './surveyData';

export interface SurveyCardProps {
  survey: Survey;
  onNewClick?(): void;
  onViewAnswersClick?(): void;
}

export default function SurveyCard({ survey, onNewClick, onViewAnswersClick }: SurveyCardProps) {
  return (
    <Box
      border="1px"
      bg="white"
      borderColor="gray.100"
      rounded="md"
      shadow="lg"
      transition="all 250ms"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-0.25rem)',
      }}>
      <Flex pos="relative" flexDir="column" w="80">
        <AspectRatio maxW="100%" ratio={4 / 2.5}>
          <Image src={surveyImageSources[survey._id]} alt="Survey Image" objectFit="cover" roundedTop="md" />
        </AspectRatio>
        <Badge colorScheme="yellow" pos="absolute" top="4" right="0" roundedRight="0" shadow="lg">
          Unanswered
        </Badge>
        <VStack flexDir="column" p="4">
          <Heading as="h4" size="sm" fontWeight="semibold">
            {survey.name}
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {survey.description ?? 'No description available.'}
          </Text>
          <HStack spacing="4" pt="4">
            <Button variant="ghost" size="sm" onClick={onViewAnswersClick}>
              View past answers
            </Button>
            <Button size="sm" colorScheme="primary" onClick={onNewClick}>
              Answer
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
}
