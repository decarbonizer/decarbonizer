import { Grid, Icon, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { GoPlus } from 'react-icons/go';
import Card from '../../components/Card';
import { useGetAllRealEstatesQuery } from '../../store/api';
import CreateRealEstateModal from './CreateRealEstateModal';
import CityCard from './CityCard';

export default function HomePage() {
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <DefaultPageLayout title="Home">
      <Grid templateColumns="repeat(3,1fr)" gap={2} rowGap={20}>
        {isLoadingRealEstates ? <Spinner /> : realEstates!.map((city) => <CityCard key={city._id} realEstate={city} />)}
        <Card as="button" border="2px" w="xl" h="xl" borderColor="gray.400" borderStyle="dashed" onClick={onOpen}>
          <Icon as={GoPlus} w="14" h="14" color="gray.600" />
          <Text color="gray.600" pt="3">
            Add new City
          </Text>
        </Card>
      </Grid>
      <CreateRealEstateModal isOpen={isOpen} onClose={onClose} />
    </DefaultPageLayout>
  );
}
