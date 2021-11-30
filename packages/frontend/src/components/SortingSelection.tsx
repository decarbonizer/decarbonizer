import { Grid, Select, Text } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortCategory {
  value: string;
  display: string;
}

export interface SortValueChangedArgs {
  sortDirection: SortDirection;
  sortCategory: string;
}

export interface SortingSelectionProps {
  sortingCategories: Array<SortCategory>;
  onChange: (e: SortValueChangedArgs) => void;
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
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={1} w="100%">
        <Text w="100%">Sort by Category:</Text>
        <Select onChange={(e) => handleCategoryChange(e)} w="100%">
          {sortingCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.display}
            </option>
          ))}
        </Select>
      </Grid>
      <Grid templateColumns="repeat(3, 1fr)" gap={1} w="100%">
        <Text w="100%">Sort by:</Text>
        <Select onChange={(e) => handleDirectionChange(e)} w="100%">
          <option value="asc">Ascending ⬆</option>
          <option value="desc">Descending ⬇</option>
        </Select>
      </Grid>
    </>
  );
}
