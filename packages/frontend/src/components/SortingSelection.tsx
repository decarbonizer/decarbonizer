import { Grid, GridItem, Select, Text, HStack, Spacer, Flex } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export type SortDirection = 'asc' | 'desc';
export type Alignment = 'horizontal' | 'vertical';

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
  alignment: Alignment;
  onChange: (e: SortValueChangedArgs) => void;
}

export default function SortingSelection({ sortingCategories, alignment, onChange }: SortingSelectionProps) {
  const [directionValue, setDirectionValue] = useState<SortDirection>('asc');
  const [categoryValue, setCategoryValue] = useState<string>(sortingCategories[0].value);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue(e.target.value);
    onChange({ sortDirection: directionValue, sortCategory: e.target.value });
  };

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDirectionValue(e.target.value as SortDirection);
    onChange({ sortDirection: e.target.value as SortDirection, sortCategory: categoryValue });
  };

  if (alignment === 'horizontal') {
    return (
      <Flex pt="3" pb="3">
        <HStack w="100%">
          <Text w="20%">Sort by Category:</Text>
          <Select onChange={(e) => handleCategoryChange(e)} w="100%" bg="white">
            {sortingCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.display}
              </option>
            ))}
          </Select>
          <Spacer />
          <Text w="10%">Sort by:</Text>
          <Select onChange={(e) => handleDirectionChange(e)} w="100%" bg="white">
            <option value="asc">Ascending ⬆</option>
            <option value="desc">Descending ⬇</option>
          </Select>
        </HStack>
      </Flex>
    );
  } else {
    return (
      <>
        <Grid templateColumns="repeat(6, 1fr)" gap={1} w="100%">
          <GridItem colStart={1} colSpan={2}>
            <Text w="100%">Sort by Category:</Text>
          </GridItem>
          <GridItem colStart={3} colSpan={3}>
            <Select onChange={(e) => handleCategoryChange(e)} w="100%">
              {sortingCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.display}
                </option>
              ))}
            </Select>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(6, 1fr)" gap={1} w="100%">
          <GridItem colStart={1} colSpan={2}>
            <Text w="100%">Sort by:</Text>
          </GridItem>
          <GridItem colStart={3} colSpan={3}>
            <Select onChange={(e) => handleDirectionChange(e)} w="100%">
              <option value="asc">Ascending ⬆</option>
              <option value="desc">Descending ⬇</option>
            </Select>
          </GridItem>
        </Grid>
      </>
    );
  }
}
