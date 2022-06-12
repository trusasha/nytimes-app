import React, { useCallback, useRef, useEffect, useState } from 'react';
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
 *  top?: number
 * }} Offsets
 */

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
 *  children: JSX.Element
 *  modal: JSX.Element
 *  modalContainerStyle?: import('react-native').ViewStyle
 *  backdrop?: JSX.Element
 *  header?: JSX.Element
 *  offsets?: Offsets
 * }} AnimatedModalProps
 */

const speed = 1;

/** @type {Measures} */
const initialMeasures = {
  width: 0,
  height: 0,
  xLeft: 0,
  xRight: 0,
  yTop: 0,
  yBottom: 0,
};

/**
 * @param {AnimatedModalProps} props
 */
const AnimatedModal = ({
  visible,
  setVisible,
  children,
  modal,
  modalContainerStyle,
  backdrop,
  header,
  offsets,
}) => {
  const { w, h } = useSpecialStyleProps();
  const S = useStyles({ modalContainerStyle });

  /** @type {React.MutableRefObject<Measures>} */
  const childrenMeasures = useRef(initialMeasures);

  const horizontalOffsets = (w - childrenMeasures.current.width) / 2;

  const modalHorizontalScale = childrenMeasures.current.width / w;
  const modalTopOffset = childrenMeasures.current.yTop + (offsets?.top || 0);
  const modalLeftOffset = childrenMeasures.current.xLeft - horizontalOffsets;
  const modalCloseHeight = childrenMeasures.current.height;

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  const onChildrenLayout = useCallback(
    ({ target }) =>
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
  const height = useSharedValue(childrenMeasures.current.height);
  const scaleX = useSharedValue(modalHorizontalScale);

  const gestureTranslateX = useSharedValue(0);
  const gestureTranslateY = useSharedValue(0);
  const gestureScale = useSharedValue(1);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      gestureTranslateX.value = event.translationX;
      gestureTranslateY.value = event.translationY;
      gestureScale.value = withTiming(0.9, { duration: 200 * speed });
    },
    onEnd: (event) => {
      if (event.translationX > 100 || event.translationY > 100) {
        onClose();
        gestureTranslateX.value = withTiming(0, { duration: 200 * speed });
        gestureTranslateY.value = withTiming(0, { duration: 200 * speed });
        gestureScale.value = withTiming(1, { duration: 200 * speed });
      } else {
        gestureTranslateX.value = withTiming(0, { duration: 200 * speed });
        gestureTranslateY.value = withTiming(0, { duration: 200 * speed });
        gestureScale.value = withTiming(1, { duration: 200 * speed });
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

  /** @type {(visible: boolean) => void} */
  const animateModal = useCallback(
    (visible) => {
      const heightValue = visible ? h : modalCloseHeight;
      const scaleXValue = visible ? 1 : modalHorizontalScale;
      const opacityValue = visible ? 1 : 0;
      const translateValue = visible ? 0 : 1;

      height.value = withTiming(heightValue, { duration: 300 * speed });
      scaleX.value = withTiming(scaleXValue, { duration: 300 * speed });
      opacity.value = withTiming(opacityValue, { duration: 400 * speed });
      translate.value = withTiming(translateValue, { duration: 300 * speed });
    },
    [h, height, modalCloseHeight, modalHorizontalScale, opacity, scaleX, translate],
  );

  useEffect(() => animateModal(visible), [animateModal, visible]);

  return (
    <View onLayout={onChildrenLayout}>
      {children}
      <Portal>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={modalStyles} pointerEvents={pointerEvents}>
            {!!header && header}
            {modal}
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={backdropStyles} pointerEvents="none">
          {!!backdrop && backdrop}
        </Animated.View>
      </Portal>
    </View>
  );
};

export default observer(AnimatedModal);
