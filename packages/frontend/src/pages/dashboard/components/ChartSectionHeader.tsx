import { Box, BoxProps, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ChartSectionHeaderProps extends BoxProps {
  header?: ReactNode;
  description?: string;
}

export default function ChartSectionHeader({ header, description, ...rest }: ChartSectionHeaderProps) {
  return (
    <Box {...rest}>
      <p>
        <Heading as="h2" size="lg">
          {header}
        </Heading>
        {description && <Text layerStyle="hint">{description}</Text>}
      </p>
    </Box>
  );
}
