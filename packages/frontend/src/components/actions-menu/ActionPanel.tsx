import { Heading, Accordion, VStack, AccordionButton, AccordionIcon, AccordionItem, Box, Icon } from '@chakra-ui/react';
import groupBy from 'lodash-es/groupBy';
import { RiDatabaseLine, RiCarLine } from 'react-icons/ri';
import { MdOutlineKitchen, MdOutlineAir } from 'react-icons/md';
import { GiHeatHaze, GiCommercialAirplane } from 'react-icons/gi';
import { BiBuildingHouse } from 'react-icons/bi';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { SurveyAnswer } from '../../api/surveyAnswer';
import ActionPanelItemSelector from './ActionPanelItemSelector';

export interface ActionPanelProps {
  surveyAnswers: Array<SurveyAnswer> | undefined;
  chosenAction: string;
  onChangeChosenAction: (value: string) => void;
}

export default function ActionPanel({ surveyAnswers, chosenAction, onChangeChosenAction }: ActionPanelProps) {
  const groupSurveyAnswers = groupBy(surveyAnswers, 'surveyId');
  return (
    <VStack minW="80%" maxW="80%">
      <Heading as="h3" size="lg" pb="5">
        Take Actions
      </Heading>
      <Accordion minW="100%" allowToggle>
        {Object.entries(groupSurveyAnswers).map(([surveyId, surveyAnswers]) => (
          <ActionPanelItemSelector
            key={surveyId}
            surveyId={surveyId}
            elements={surveyAnswers}
            chosenAction={chosenAction}
            onChangeChosenAction={onChangeChosenAction}
          />
        ))}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={RiDatabaseLine} /> IT
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={MdOutlineKitchen} /> Kitchen
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={GiHeatHaze} /> Heating
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={MdOutlineAir} /> Air Condition
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={GiCommercialAirplane} /> Business Travel
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={RiCarLine} /> Car fleet
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={BiBuildingHouse} /> Building Isolation
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={HiOutlineVideoCamera} /> Video Conference
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
