import React, { useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Text } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';
import { useSpecialStyleProps } from 'hooks/newUseStyles';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

/**
 * @typedef {{
 * width: number
 * height: number
 * xLeft: number
 * xRight: number
 * yTop: number
 * yBottom: number
 * }} Measures
 */

/**
 * @typedef {{
 *  visible: boolean
 *  setVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  title?: string
 *  children: JSX.Element
 *  modal: JSX.Element
 *  offsets?: {top: number}
 * }} AnimatedModalProps
 */

/**
 * @param {AnimatedModalProps} props
 */
const AnimatedModal = ({ visible, setVisible, title, children, modal, offsets }) => {
  const { w, h } = useSpecialStyleProps();
  const S = useStyles();

  /** @type {React.MutableRefObject<Measures>} */
  const childrenMeasures = useRef(null);

  /** @type {React.MutableRefObject<View>} */
  const childrenRef = useRef(null);

  const horizontalOffsets = (w - (childrenMeasures.current?.width || 0)) / 2;

  const modalHorizontalScale = (childrenMeasures.current?.width || w) / w;
  const modalTopOffset = (childrenMeasures.current?.yTop || 0) + (offsets?.top || 0);
  const modalLeftOffset = (childrenMeasures.current?.xLeft || 0) - horizontalOffsets;
  const modalCloseHeight = childrenMeasures.current?.height || 0;

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  const onChildrenLayout = useCallback(
    ({ nativeEvent, target }) =>
      target.measure((x, y, width, height, pageX, pageY) => {
        childrenMeasures.current = {
          width,
          height,
          xLeft: Math.round(x + pageX),
          xRight: w - Math.round(x + pageX),
          yTop: Math.round(y + pageY),
          yBottom: h - Math.round(y + pageY) + height,
        };
      }),
    [h, w],
  );

  const opacity = useSharedValue(0);
  const translate = useSharedValue(1);
  const height = useSharedValue(childrenMeasures.current?.height || 0);
  const scaleX = useSharedValue(modalHorizontalScale);

  const gestureTranslateX = useSharedValue(0);
  const gestureTranslateY = useSharedValue(0);
  const gestureScale = useSharedValue(1);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      gestureTranslateX.value = event.translationX;
      gestureTranslateY.value = event.translationY;
      gestureScale.value = withTiming(0.9, { duration: 200 });
    },
    onEnd: (event) => {
      if (event.translationX > 100 || event.translationY > 100) {
        onClose();
        gestureTranslateX.value = withTiming(0, { duration: 200 });
        gestureTranslateY.value = withTiming(0, { duration: 200 });
        gestureScale.value = withTiming(1, { duration: 200 });
      } else {
        gestureTranslateX.value = withTiming(0, { duration: 200 });
        gestureTranslateY.value = withTiming(0, { duration: 200 });
        gestureScale.value = withTiming(1, { duration: 200 });
      }
    },
  });

  const reanimatedStyle = useAnimatedStyle(
    () => ({
      height: height.value,
      opacity: opacity.value,
      transform: [
        { translateY: translate.value * modalTopOffset + gestureTranslateY.value },
        { translateX: translate.value * modalLeftOffset + gestureTranslateX.value },
        { scaleX: scaleX.value },
        { scale: gestureScale.value },
      ],
    }),
    [modalTopOffset, modalLeftOffset],
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalStyles = [S.container, reanimatedStyle];
  const backdropStyles = [S.backdrop, backdropStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  useEffect(() => {
    const heightValue = visible ? h : modalCloseHeight;
    const scaleXValue = visible ? 1 : modalHorizontalScale;
    const opacityValue = visible ? 1 : 0;
    const translateValue = visible ? 0 : 1;

    height.value = withTiming(heightValue, { duration: 500 });
    scaleX.value = withTiming(scaleXValue, { duration: 600 });
    opacity.value = withTiming(opacityValue, { duration: 600 });
    translate.value = withTiming(translateValue, { duration: 600 });
  }, [translate, opacity, height, visible, h, scaleX, modalHorizontalScale, modalCloseHeight]);

  return (
    <View ref={childrenRef} onLayout={onChildrenLayout}>
      {children}
      <Portal>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={modalStyles} pointerEvents={pointerEvents}>
            <View style={S.header}>
              <TouchableOpacity style={S.backButton} onPress={onClose} />
              {!!title && <Text style={S.title} children={title} />}
            </View>
            {modal}
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={backdropStyles} pointerEvents="none" />
      </Portal>
    </View>
  );
};

export default observer(AnimatedModal);
