import React from 'react';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * @typedef {{
 *  children?: JSX.Element
 *  style?: import('react-native').ViewStyle
 *  onTap?: () => void
 *  rippleColor?: string
 * }} RippleViewProps
 */

/**
 * @param {RippleViewProps & import('react-native').ViewProps} props
 */
const RippleView = ({ children, onTap, style, rippleColor }) => {
  /** @type {React.RefObject<View>} */
  const aRef = useAnimatedRef();

  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);

  const tapGestureEvent = useAnimatedGestureHandler({
    onStart: (event) => {
      const layout = measure(aRef);

      width.value = layout.width;
      height.value = layout.height;

      centerX.value = event.x;
      centerY.value = event.y;

      rippleOpacity.value = 1;
      scale.value = 0;
      scale.value = withTiming(1, { duration: 1000 });
    },
    onActive: () => {
      !!onTap && runOnJS(onTap)();
    },
    onFinish: () => {
      rippleOpacity.value = withTiming(0, { duration: 300 });
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: rippleColor || 'rgba(0,0,0,0.2)',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [
        { translateX },
        { translateY },
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <View ref={aRef}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, { overflow: 'hidden' }]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default observer(RippleView);
