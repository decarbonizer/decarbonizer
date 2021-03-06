import { VStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface QuickInfoLabelDescriptionProps {
  label?: ReactNode;
  description?: ReactNode;
  furtherDescription?: ReactNode;
}

export default function QuickInfoLabelDescription({
  label,
  description,
  furtherDescription,
}: QuickInfoLabelDescriptionProps) {
  return (
    <VStack alignItems="flex-start" spacing="0">
      {label && (
        <Text as="h4" size="sm" fontSize="3xl" fontWeight="bold" isTruncated>
          {label}
        </Text>
      )}
      {description && <Text layerStyle="hint">{description}</Text>}
      {furtherDescription && <Text layerStyle="hint">{furtherDescription}</Text>}
    </VStack>
  );
}
