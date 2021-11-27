import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  RadioGroup,
  VStack,
  Text,
  Icon,
  Radio,
  AccordionIcon,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { IoBulbOutline } from 'react-icons/io5';
import { useContext } from 'react';
import { PopUpContext } from '../../pages/dashboard/pop-up/PopUpContext';
import { FormSchema } from '../../form-engine/formSchema';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { priorityOptions } from '../../pages/dashboard/pop-up/PopUp';

const schemaLED: FormSchema = {
  pages: [
    {
      elements: [
        {
          id: 'chooseTimePeriod',
          required: false,
          label: 'Choose time period',
          type: 'dates',
        },
        priorityOptions,
      ],
    },
  ],
};

export interface ActionPanelIlluminationItemProps {
  elements: Array<IlluminationSurveyAnswerValue>;
  description?: string;
}

export default function ActionPanelIlluminationItem({ elements, description }: ActionPanelIlluminationItemProps) {
  const shouldContainLEDAction = elements.some(
    (surveyAnswer) =>
      (surveyAnswer.bulbType === '00000000-0000-0000-0000-000000000000' ||
        surveyAnswer.bulbType === '00000000-0000-0000-0000-000000000001') &&
      surveyAnswer.isIlluminantExchangeable,
  );
  const popUp = useContext(PopUpContext);

  return (
    <AccordionItem maxW="100%">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Icon as={IoBulbOutline} /> Illumination
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Text>{description}</Text>
        <Text pb="5">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua.
        </Text>
        {shouldContainLEDAction && (
          <VStack>
            <Heading size="sm">Change to LED lamps</Heading>
            <RadioGroup>
              <VStack align="flex-start">
                <Radio value="00000000-0000-0000-0000-000000000003"> LED 800 lum </Radio>
                <Radio value="00000000-0000-0000-0000-000000000002"> LED 1300 lum </Radio>
              </VStack>
            </RadioGroup>
          </VStack>
        )}
        <Flex justifyContent="right" paddingTop="5">
          <Button
            colorScheme="primary"
            onClick={() => {
              popUp.onOpen(schemaLED);
            }}>
            Details..
          </Button>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
