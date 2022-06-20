import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';
import { useSpecialStyleProps } from 'hooks/newUseStyles';
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedRef,
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
 * x: number
 * y: number
 * pageX: number
 * pageY: number
 * }} Measures
 */

/**
 * @typedef {{
 * translateX: number
 * translateY: number
 * height: number
 * scaleX: number
 * }} ModalPosition
 */

/**
 * @typedef {{
 *  visible: boolean
 *  setVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  children: JSX.Element
 *  modal: JSX.Element
 *  modalContainerStyle?: import('react-native').ViewStyle
 *  backdrop?: JSX.Element
 *  backdropStyles?: import('react-native').ViewStyle
 *  header?: JSX.Element
 *  offsets?: Offsets
 * }} AnimatedModalProps
 */

const speed = 1;

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
  backdropStyles,
  header,
  offsets,
}) => {
  const { w, h } = useSpecialStyleProps();
  const S = useStyles({ modalContainerStyle, backdropStyles });

  /** @type {React.RefObject<View>} */
  const childrenMeasures = useAnimatedRef();

  const onClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const height = useSharedValue(0);
  const scaleX = useSharedValue(1);

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
        runOnJS(onClose)();
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

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value + gestureTranslateY.value },
        { translateX: translateX.value + gestureTranslateX.value },
        { scaleX: scaleX.value },
        { scale: gestureScale.value },
      ],
    };
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalAnimatedStyles = [S.container, reanimatedStyle];
  const backdropAnimatedStyles = [S.backdrop, backdropStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  /** @type {(measures: Measures) => ModalPosition} */
  const getCloseParameters = useCallback(
    (measures) => {
      'worklet';
      return {
        translateX: measures.pageX - (w - measures.width) / 2,
        translateY: measures.pageY + (offsets?.top || 0),
        height: measures.height,
        scaleX: measures.width / w,
      };
    },
    [offsets?.top, w],
  );

  const showModal = useCallback(() => {
    runOnUI(() => {
      'worklet';
      try {
        const parameters = getCloseParameters(measure(childrenMeasures));

        translateX.value = parameters.translateX;
        translateY.value = parameters.translateY;
        height.value = parameters.height;
        scaleX.value = parameters.scaleX;

        height.value = withTiming(h, { duration: 300 * speed });
        scaleX.value = withTiming(1, { duration: 300 * speed });
        opacity.value = withTiming(1, { duration: 400 * speed });
        translateX.value = withTiming(0, { duration: 300 * speed });
        translateY.value = withTiming(0, { duration: 300 * speed });
      } catch {}
    })();
  }, [childrenMeasures, getCloseParameters, h, height, opacity, scaleX, translateX, translateY]);

  const hideModal = useCallback(() => {
    runOnUI(() => {
      'worklet';
      try {
        const parameters = getCloseParameters(measure(childrenMeasures));

        height.value = withTiming(parameters.height, { duration: 300 * speed });
        scaleX.value = withTiming(parameters.scaleX, { duration: 300 * speed });
        opacity.value = withTiming(0, { duration: 400 * speed });
        translateX.value = withTiming(parameters.translateX, { duration: 300 * speed });
        translateY.value = withTiming(parameters.translateY, { duration: 300 * speed });
      } catch {}
    })();
  }, [childrenMeasures, getCloseParameters, height, opacity, scaleX, translateX, translateY]);

  useEffect(() => (visible ? showModal() : hideModal()), [hideModal, showModal, visible]);

  return (
    <View ref={childrenMeasures}>
      {children}
      <Portal>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={modalAnimatedStyles} pointerEvents={pointerEvents}>
            {!!header && header}
            {modal}
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={backdropAnimatedStyles} pointerEvents="none">
          {!!backdrop && backdrop}
        </Animated.View>
      </Portal>
    </View>
  );
};

export default observer(AnimatedModal);
