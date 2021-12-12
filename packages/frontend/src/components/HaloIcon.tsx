import { As, BoxProps, Center, ComponentSingleStyleConfig, Icon, ThemingProps, useStyleConfig } from '@chakra-ui/react';

export interface HaloIconProps extends BoxProps, ThemingProps {
  icon?: As;
}

export const HaloIconTheme: ComponentSingleStyleConfig = {
  baseStyle: {
    opacity: 0.8,
    rounded: 'full',
  },
  sizes: {
    md: {
      p: '3',
      w: '16',
      h: '16',
    },
  },
  defaultProps: {
    size: 'md',
  },
};

export default function HaloIcon({ icon, colorScheme = 'primary', ...rest }: HaloIconProps) {
  const styles = useStyleConfig('HaloIcon', rest);

  return (
    <Center bg={`${colorScheme}.100`} __css={styles} {...rest}>
      <Icon as={icon} w="100%" h="100%" color={`${colorScheme}.900`} />
    </Center>
  );
}
