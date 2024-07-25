import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import type { StackProps, TabLayout, TabsTabProps } from 'tamagui';

import { AnimatePresence, Tabs, YStack } from 'tamagui';
import { ThemedText } from './ThemedText';

export default ExpenseTabSelector = ({
  setCurrentTab: setCurrentTabExternal,
}) => {
  const [tabState, setTabState] = useState<{
    currentTab: string;
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null;
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null;
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null;
  }>({
    activeAt: null,

    currentTab: 'expense',

    intentAt: null,

    prevActiveAt: null,
  });
  const colorScheme = useColorScheme();
  const setCurrentTab = (currentTab: string) => {
    setCurrentTabExternal(currentTab);
    setTabState({ ...tabState, currentTab });
  };

  const setIntentIndicator = intentAt => setTabState({ ...tabState, intentAt });

  const setActiveIndicator = activeAt =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });

  const { activeAt, intentAt, currentTab } = tabState;
  // 1 = right, 0 = nowhere, -1 = left

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };
  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      padding="$2"
      flexDirection="column"
      activationMode="manual"
      ai={'center'}
      backgroundColor={Colors[colorScheme].background}
      borderRadius="$10"
      position="relative">
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              borderRadius="$4"
              width={intentAt.width}
              height={intentAt.height}
              x={intentAt.x}
              y={intentAt.y}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              borderRadius="$8"
              theme={colorScheme}
              width={activeAt.width}
              height={activeAt.height}
              x={activeAt.x}
              y={activeAt.y}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          gap="$2"
          backgroundColor="transparent">
          <Tabs.Tab
            unstyled
            paddingVertical="$2"
            paddingHorizontal="$3"
            value="expense"
            onInteraction={handleOnInteraction}>
            <ThemedText type="defaultSemiBold">Expense</ThemedText>
          </Tabs.Tab>

          <Tabs.Tab
            unstyled
            paddingVertical="$2"
            paddingHorizontal="$3"
            value="income"
            onInteraction={handleOnInteraction}>
            <ThemedText type="defaultSemiBold">Income</ThemedText>
          </Tabs.Tab>
        </Tabs.List>
      </YStack>
    </Tabs>
  );
};

const TabsRovingIndicator = ({
  active,
  ...props
}: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor="$color5"
      opacity={0.7}
      animation="100ms"
      enterStyle={styles.opacity}
      exitStyle={styles.opacity}
      {...(active && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  opacity: { opacity: 0 },
});
