import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { energySurvey } from '../../form-engine/energySurvey';
import FormEngine from '../../form-engine/FormEngine';
import { useGetAllBulbsQuery } from '../../store/api';

export default function SurveyContainer() {
  const schema = energySurvey;
  const [page, setPage] = useState(1);
  const [value, setValue] = useState({});
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();

  if (isLoadingBulbs) {
    return <>Loading...</>;
  }

  return (
    <Center w="100%" h="100%">
      <Tabs w="100%" h="100%" maxH="70vh" maxW="70vw">
        <TabList>
          <Tab>Survey</Tab>
          <Tab>Schema</Tab>
          <Tab>Value</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack align="flex-start">
              <FormEngine
                schema={schema}
                choiceOptionProviders={{
                  bulbs: bulbs!.map((bulb) => ({ value: bulb._id, display: bulb.name })),
                }}
                currentPage={page}
                currentValue={value}
                onCurrentPageChanged={(e) => setPage(e.currentPage)}
                onCurrentValueChanged={(e) => setValue(e.currentValue)}
              />
              <HStack w="100%" marginTop="4" paddingTop="4" justify="flex-end" borderTopWidth="1px" borderColor="gray">
                <Text>Page:</Text>
                <NumberInput
                  value={page}
                  min={1}
                  max={schema.pages.length}
                  onChange={(num) => setPage(isNaN(+num) ? 1 : +num)}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel>
            <ReactJson src={schema} />
          </TabPanel>
          <TabPanel>
            <ReactJson src={value} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Center>
  );
}
