/* eslint-disable react/jsx-no-undef */
import {
  Grid,
  Icon,
  Tooltip,
  VStack,
  Text,
  Spacer,
  Button,
  HStack,
  Flex,
  AspectRatio,
  Image,
  Heading,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { GoPlus } from 'react-icons/go';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Card from '../../components/Card';
import { useGetAllRealEstatesQuery } from '../../store/api';
import { useHistory } from 'react-router';
import { routes } from '../../routes';
import CreateRealEstateModal from './CreateRealEstateModal';

export default function HomePage() {
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();

  function startSurvey(realEstateId: string) {
    history.push(routes.surveys({ realEstateId }));
  }

  function goToDashboard(realEstateId: string) {
    history.push(routes.realEstateDashboard({ realEstateId }));
  }

  return (
    <DefaultPageLayout title="Home">
      {/* <RealEstateBox /> */}
      <Grid templateColumns="repeat(3,1fr)" gap={2} rowGap={20}>
        {isLoadingRealEstates
          ? console.log('Lädt')
          : realEstates!.map((city, index) => (
              <Card key={index} pos="relative" display="flex" flexDir="column" w="md" h="xl">
                <AspectRatio maxW="100%" ratio={4 / 2.25}>
                  <Image src="https://via.placeholder.com/150" alt="Survey Image" objectFit="cover" roundedTop="md" />
                </AspectRatio>
                <VStack>
                  <Heading as="h4" size="md" fontWeight="semibold" pt="3">
                    {city.cityName}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {city.description ?? 'No description available.'}
                  </Text>
                  <Grid templateColumns="repeat(2,1fr)" pt="8" gap={4}>
                    <Box borderColor="black">
                      <p>
                        <b>Size of the office:</b> {city.area} m<sup>2</sup>
                      </p>
                      <p>
                        <b>Number of employees: </b>
                        {city.employees}
                      </p>
                    </Box>

                    <Box borderColor="black" border="1px" w="100%" h="36" pt="8">
                      <Text>TODO: Display something</Text>
                    </Box>
                  </Grid>

                  <Flex position="absolute" bottom="5" right="4">
                    <HStack>
                      <Button
                        rightIcon={<AiOutlineArrowRight />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => goToDashboard(city._id)}>
                        Dashboard
                      </Button>
                      <Spacer />
                      <Button
                        rightIcon={<AiOutlineArrowRight />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => startSurvey(city._id)}>
                        Survey Overview
                      </Button>
                    </HStack>
                  </Flex>
                </VStack>
              </Card>
            ))}
        <Tooltip label="Add new city" hasArrow>
          <Card as="button" border="2px" w="md" h="xl" borderColor="gray.400" borderStyle="dashed" onClick={onOpen}>
            <Icon as={GoPlus} w="14" h="14" color="gray.600" />
          </Card>
        </Tooltip>
      </Grid>
      <CreateRealEstateModal isOpen={isOpen} onClose={onClose} />
    </DefaultPageLayout>
  );
}
