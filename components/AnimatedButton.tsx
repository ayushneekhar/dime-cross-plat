import React, { useCallback } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedButton = ({ onPress, children, style }) => {
  const pressed = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const cancelPress = useCallback(() => {
    pressed.value = false;
  }, [pressed]);

  const gesture = Gesture.Pan()
    .onBegin(event => {
      pressed.value = true;
      startX.value = event.x;
      startY.value = event.y;
    })
    .onUpdate(event => {
      const dx = Math.abs(event.x - startX.value);
      const dy = Math.abs(event.y - startY.value);
      if (dx > 80 || dy > 50) {
        runOnJS(cancelPress)();
      }
    })
    .onFinalize(() => {
      if (pressed.value) {
        pressed.value = false;
        runOnJS(onPress)();
      }
    })
    .minDistance(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(pressed.value ? 0.8 : 1) }],
      opacity: withSpring(pressed.value ? 0.8 : 1),
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[...(Array.isArray(style) ? style : [style]), animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default AnimatedButton;
