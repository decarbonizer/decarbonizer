import { useState } from 'react';
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
  Grid,
} from '@chakra-ui/react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { RiAddLine } from 'react-icons/ri';
import { BiCube } from 'react-icons/bi';
import CreateRealEstateModal from './CreateRealEstateModal';
import { useGetAllRealEstatesQuery } from '../../store/api';
import { useHistory } from 'react-router';
import { routes } from '../../routes';

export default function RealEstateBox() {
  const [tabIndex, setTabIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const history = useHistory();

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  function startSurvey(realEstateId: string) {
    history.push(routes.surveys({ realEstateId }));
  }

  function goToDashboard(realEstateId: string) {
    history.push(routes.realEstateDashboard({ realEstateId }));
  }

  if (isLoadingRealEstates) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="green.200"
        color="green.500"
        size="xl"
        position="absolute"
        left="50%"
        top="30%"
        transform="translate(-50%, -50%)"
      />
    );
  }

  if (!realEstates) {
    return (
      <Box position="absolute" left="50%" top="30%" transform="translate(-50%, -50%)">
        Something went wrong!
      </Box>
    );
  }

  return (
    <Box backgroundColor="green.50" border="1px" borderColor="green.300" borderRadius="md" width="900px" height="500px">
      <Tabs variant="enclosed" colorScheme="green" p="4" height="90%" onChange={handleTabsChange}>
        <Box position="relative">
          <TabList
            overflowX="auto"
            width="80%"
            paddingLeft="2"
            paddingRight="2"
            paddingTop="2"
            css={{
              scrollbarWidth: 'none',
              '::-webkit-scrollbar': { display: 'none' },
              '-webkit-overflow-scrolling': 'touch',
            }}>
            {realEstates.map((city, index) => (
              <Tab key={index}>{city.cityName}</Tab>
            ))}
          </TabList>
          <Button
            rightIcon={<RiAddLine />}
            position="absolute"
            top="2"
            right="12px"
            colorScheme="green"
            onClick={onOpen}>
            Add new
          </Button>
          <CreateRealEstateModal isOpen={isOpen} onClose={onClose} />
        </Box>
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
                    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                      <Button
                        rightIcon={<AiOutlineArrowRight />}
                        colorScheme="green"
                        onClick={() => goToDashboard(city._id)}>
                        Go to overview
                      </Button>
                      <Spacer />
                      <Spacer />
                      <Spacer />
                      <Button
                        rightIcon={<AiOutlineArrowRight />}
                        colorScheme="green"
                        onClick={() => startSurvey(city._id)}>
                        Start survey
                      </Button>
                    </Grid>
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
