import { Select, Stack, StackProps } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortCategory {
  value: string;
  display: string;
}

export interface SortValueChangedArgs {
  sortDirection: SortDirection;
  sortCategory?: string;
}

export interface SortingSelectionProps extends Omit<StackProps, 'onChange'> {
  sortingCategories: Array<SortCategory>;
  onSortChanged(e: SortValueChangedArgs): void;
}

export default function SortingSelection({
  sortingCategories,
  onSortChanged,
  direction = 'row',
  ...rest
}: SortingSelectionProps) {
  const [directionValue, setDirectionValue] = useState<SortDirection>('asc');
  const [categoryValue, setCategoryValue] = useState<string | undefined>(undefined);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value ? e.target.value : undefined;
    setCategoryValue(newCategory);
    onSortChanged({ sortDirection: directionValue, sortCategory: newCategory });
  };

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDirectionValue(e.target.value as SortDirection);
    onSortChanged({ sortDirection: e.target.value as SortDirection, sortCategory: categoryValue });
  };

  return (
    <Stack w="100%" pt="3" pb="3" direction={direction} {...rest}>
      <Select placeholder="Sort by..." onChange={(e) => handleCategoryChange(e)} w="100%" bg="white">
        {sortingCategories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.display}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => handleDirectionChange(e)} w="100%" bg="white">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>
    </Stack>
  );
}
