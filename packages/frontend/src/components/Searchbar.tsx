import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

export interface SearchbarProps {
  placeholder: string;
  onChange(e: string): void;
}

export default function Searchbar({ placeholder, onChange }: SearchbarProps) {
  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <InputGroup bg="white" maxW="md">
      <InputLeftElement>
        <FiSearch color="gray.200" />
      </InputLeftElement>
      <Input focusBorderColor="gray.300" placeholder={placeholder} onChange={(e) => handleFilter(e)} />
    </InputGroup>
  );
}
