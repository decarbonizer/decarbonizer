import React from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Button,
  Flex,
  Spacer,
  Icon,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BiCube } from 'react-icons/bi';

interface CityBoxComponentProps {
    cities: Array<{
      name: string;
      description: string;
      capacity: number;
      size: number;
    }>;
  }

export default function CityBoxComponent({ cities }: CityBoxComponentProps) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  function startSurvey() {
    console.log(cities[tabIndex]); //TODO: implement start survey
  }
  return (
    <Box backgroundColor="green.50" border="1px" borderColor="green.300" borderRadius="md" width="900px" height="500px">
      <Tabs variant="enclosed" colorScheme="green" p="4" height="90%" onChange={handleTabsChange}>
        <TabList>
          {cities.map((city, index) => (
            <Tab key={index}>{city.name}</Tab>
          ))}
        </TabList>
        <TabPanels height="100%">
          {cities.map((city, index) => (
            <TabPanel key={index} roundedBottom="md" height="100%" position="relative">
              <Box>
                <SimpleGrid columns={2} rows={2} spacing={10} h="xs">
                  <Center>
                    <Box alignItems="center">
                      <p>{city.description}</p>
                    </Box>
                  </Center>
                  <SimpleGrid rows={2}>
                    <Center>
                      <Icon
                        as={BiCube}
                        boxSize="110"
                        color="green"
                        _hover={{ transform: 'scale(1.5)', transitionDuration: '0.5s' }}
                      />
                    </Center>
                    <Center>
                      <SimpleGrid rows={2} spacing={5}>
                        <Box>
                          <p>
                            <b>Size of the office:</b> {city.size} m<sup>2</sup>
                          </p>
                        </Box>
                        <Box>
                          <p>
                            <b>Number of employees: </b>
                            {city.capacity}
                          </p>
                        </Box>
                      </SimpleGrid>
                    </Center>
                  </SimpleGrid>
                  <Flex p="3" position="absolute" bottom="0" right="0">
                    <Spacer />
                    <Button rightIcon={<AiOutlineArrowRight />} colorScheme="green" onClick={startSurvey}>
                      Start survey
                    </Button>
                  </Flex>
                </SimpleGrid>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}