import { HStack, Select, Text } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortCategory {
  value: string;
  display: string;
}

export interface SortingSelectionProps {
  sortingCategories: Array<SortCategory>;
  onChange: (e: { sortDirection: SortDirection; sortCategory: string }) => void;
}

export default function SortingSelection({ sortingCategories, onChange }: SortingSelectionProps) {
  const [directionValue, setDirectionValue] = useState<SortDirection>('asc');
  const [categoryValue, setCategoryValue] = useState<string>('');

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue(e.target.value);
    onChange({ sortDirection: directionValue, sortCategory: e.target.value });
  };

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDirectionValue(e.target.value as SortDirection);
    onChange({ sortDirection: e.target.value as SortDirection, sortCategory: categoryValue });
  };

  return (
    <HStack w="100%" justify="flex-start" spacing="3">
      <Text>Sort by Category: </Text>
      <Select onChange={(e) => handleCategoryChange(e)} maxW="xl" placeholder="Select category">
        {sortingCategories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.display}
          </option>
        ))}
      </Select>
      <Text minWidth="max-content">Sort by: </Text>
      <Select maxW="48" onChange={(e) => handleDirectionChange(e)}>
        <option value="asc">Ascending ⬆</option>
        <option value="desc">Descending ⬇</option>
      </Select>
    </HStack>
  );
}
