import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, StackProps } from 'tamagui';

export type ThemedViewProps = StackProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  return (
    <Stack
      style={[{ backgroundColor }, ...(Array.isArray(style) ? style : [style])]}
      {...otherProps}
    />
  );
}
