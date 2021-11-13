import React from 'react';
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
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { RiAddLine } from 'react-icons/ri';
import { BiCube } from 'react-icons/bi';
import AddCityComponent from './AddCityComponent';
import { useGetAllRealEstatesQuery } from '../../store/api';

export default function CityBoxComponent() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  function startSurvey() {
    console.log(tabIndex); //TODO: implement start survey
  }

  if (isLoadingRealEstates)
    return <Spinner thickness="4px" speed="0.65s" emptyColor="green.200" color="green.500" size="xl" />;
  if (!realEstates) return <Box>Something went wrong!</Box>;

  return (
    <Box backgroundColor="green.50" border="1px" borderColor="green.300" borderRadius="md" width="900px" height="500px">
      <Tabs variant="enclosed" colorScheme="green" p="4" height="90%" onChange={handleTabsChange}>
        <TabList position="relative">
          {realEstates.map((city, index) => (
            <Tab key={index}>{city.cityName}</Tab>
          ))}
          <Button
            rightIcon={<RiAddLine />}
            position="absolute"
            top="0"
            right="12px"
            colorScheme="green"
            onClick={onOpen}>
            Add city
          </Button>
          <AddCityComponent isOpen={isOpen} onClose={onClose} />
        </TabList>
        <TabPanels height="100%">
          {realEstates.map((city, index) => (
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
                            <b>Size of the office:</b> {city.area} m<sup>2</sup>
                          </p>
                        </Box>
                        <Box>
                          <p>
                            <b>Number of employees: </b>
                            {city.employees}
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
