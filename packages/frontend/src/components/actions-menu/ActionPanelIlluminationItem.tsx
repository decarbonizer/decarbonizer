import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { IoBulbOutline } from 'react-icons/io5';
import { useContext } from 'react';
import { PopUpContext } from '../../pages/dashboard/pop-up/PopUpContext';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';

export interface ActionPanelIlluminationItemProps {
  elements: Array<IlluminationSurveyAnswerValue>;
  description?: string;
  chosenAction: string;
  onChangeChosenAction: (value: string) => void;
}

export default function ActionPanelIlluminationItem({
  elements,
  description,
  chosenAction,
  onChangeChosenAction,
}: ActionPanelIlluminationItemProps) {
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
            <RadioGroup onChange={onChangeChosenAction} value={chosenAction}>
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
              popUp.onOpen('led');
            }}>
            Details..
          </Button>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
