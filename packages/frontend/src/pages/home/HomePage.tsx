import { Icon, Spinner, Text, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { GoPlus } from 'react-icons/go';
import Card from '../../components/Card';
import CreateRealEstateModal from './CreateRealEstateModal';
import RealEstateCard from './RealEstateCard';
import cloud from '../../img/cloud.svg';
import Searchbar from '../../components/Searchbar';
import orderBy from 'lodash-es/orderBy';
import { useState } from 'react';
import SortingSelection, { SortValueChangedArgs, SortCategory } from '../../components/SortingSelection';
import EmptyState from '../../components/EmptyState';
import { useGetRealEstatesOfCompanyQuery } from '../../store/api';
import GlobalSection from './global/GlobalSection';

export default function HomePage() {
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetRealEstatesOfCompanyQuery();
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
      <GlobalSection />
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
              <RealEstateCard key={city._id} realEstate={city} />
            </WrapItem>
          ))
        )}
      </Wrap>
      <CreateRealEstateModal isOpen={isOpen} onClose={onClose} />
    </DefaultPageLayout>
  );
}
