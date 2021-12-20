import { Icon, Spinner, Text, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { GoPlus } from 'react-icons/go';
import Card from '../../components/Card';
import { useGetAllRealEstatesQuery } from '../../store/api';
import CreateRealEstateModal from './CreateRealEstateModal';
import CityCard from './CityCard';
import cloud from '../../img/cloud.svg';
import Searchbar from '../../components/Searchbar';
import orderBy from 'lodash-es/orderBy';
import { useState } from 'react';
import SortingSelection, { SortValueChangedArgs, SortCategory } from '../../components/SortingSelection';
import EmptyState from '../../components/EmptyState';

export default function HomePage() {
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSortValue, setCurrentSortValue] = useState<SortValueChangedArgs>({
    sortCategory: undefined,
    sortDirection: 'asc',
  });

  const [searchValue, setSearchValue] = useState<string>('');

  const filteredRealEstates = realEstates?.filter((realEstate) => {
    return realEstate.cityName.toLowerCase().includes(searchValue.toLowerCase());
  });

  const sortedRealEstates = orderBy(
    filteredRealEstates,
    [currentSortValue.sortCategory ?? 'cityName'],
    [currentSortValue.sortDirection],
  );

  const sortCategory: SortCategory[] = [
    { value: 'cityName', display: 'Name' },
    { value: 'createdAt', display: 'Created at' },
    { value: 'updatedAt', display: 'Updated at' },
  ];

  return (
    <DefaultPageLayout
      title="Home"
      actions={
        <>
          <SortingSelection
            w="2xl"
            sortingCategories={sortCategory}
            onSortChanged={setCurrentSortValue}
            direction="row"
          />
          <Searchbar placeholder="Search for real estate" onChange={setSearchValue} />
        </>
      }>
      <Wrap spacing="8">
        {!searchValue && (
          <WrapItem>
            <Card as="button" border="2px" w="xl" h="xl" borderColor="gray.400" borderStyle="dashed" onClick={onOpen}>
              <Icon as={GoPlus} w="14" h="14" color="gray.600" />
              <Text color="gray.600" pt="3">
                New real estate
              </Text>
            </Card>
          </WrapItem>
        )}
        {isLoadingRealEstates ? (
          <Spinner />
        ) : sortedRealEstates.length === 0 ? (
          <EmptyState imgSrc={cloud} title="No Result" description={`Could not find a real estate`} />
        ) : (
          sortedRealEstates!.map((city) => (
            <WrapItem key={city._id}>
              <CityCard key={city._id} realEstate={city} />
            </WrapItem>
          ))
        )}
      </Wrap>
      <CreateRealEstateModal isOpen={isOpen} onClose={onClose} />
    </DefaultPageLayout>
  );
}
