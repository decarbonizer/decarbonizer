import { Box, StackProps, Stack, VStack, Text, Heading, Center } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { VscError } from 'react-icons/vsc';
import HaloIcon from './HaloIcon';

export interface InlineErrorDisplayProps extends StackProps {
  error?: any;
  children?: ReactNode;
}

export default function InlineErrorDisplay({ error, children, ...rest }: InlineErrorDisplayProps) {
  if (!error) {
    return <Box {...rest}>{children}</Box>;
  }

  return (
    <Stack direction="row" {...rest}>
      <HaloIcon colorScheme="red" icon={VscError} />
      <Center>
        <VStack flexGrow={1} alignItems="flex-start">
          <Heading as="h4" size="sm" isTruncated>
            Whoops! An unexpected error occured.
          </Heading>
          <Text layerStyle="hint" isTruncated>
            You may try reloading the page to fix this error.
          </Text>
        </VStack>
      </Center>
    </Stack>
  );
}
