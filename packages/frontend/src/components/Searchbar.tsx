import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

export interface SearchbarProps {
  placeholder: string;
  onChange: (e: string) => void;
}

export default function Searchbar({ placeholder, onChange }: SearchbarProps) {
  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <InputGroup>
      <InputLeftElement>
        <FiSearch color="gray.300" />
      </InputLeftElement>
      <Input placeholder={placeholder} bg="white" onChange={(e) => handleFilter(e)} />
    </InputGroup>
  );
}
