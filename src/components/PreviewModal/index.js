import React, { useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSpecialStyleProps } from 'hooks/newUseStyles';

/**
 * @typedef {{
 *  actionModal?: JSX.Element
 * }} PreviewModalProps
 */

/** @type {import('components/AnimatedModal').Measures} */
const initialMeasures = {
  width: 0,
  height: 0,
  xLeft: 0,
  yTop: 0,
};

const speed = 1;
const margin = 12;

/**
 * @param {import('components/AnimatedModal').AnimatedModalProps & PreviewModalProps} props
 */
const PreviewModal = ({
  visible,
  setVisible,
  children,
  modal,
  modalContainerStyle,
  actionModal,
  backdrop,
  header,
  offsets,
}) => {
  const { w, h } = useSpecialStyleProps();
  const S = useStyles({ modalContainerStyle });

  /** @type {React.MutableRefObject<import('components/AnimatedModal').Measures>} */
  const childrenMeasures = useRef(initialMeasures);
  /** @type {React.MutableRefObject<import('components/AnimatedModal').Measures>} */
  const headerMeasures = useRef(initialMeasures);
  /** @type {React.MutableRefObject<import('components/AnimatedModal').Measures>} */
  const modalMeasures = useRef(initialMeasures);
  /** @type {React.MutableRefObject<import('components/AnimatedModal').Measures>} */
  const actionMeasures = useRef(initialMeasures);

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  const onChildrenLayout = useCallback(
    ({ target }) =>
      target.measure((x, y, width, height, pageX, pageY) => {
        childrenMeasures.current = {
          width,
          height,
          xLeft: Math.round(x + pageX),
          yTop: Math.round(y + pageY),
        };
      }),
    [],
  );

  const onHeaderLayout = useCallback(
    ({ target }) =>
      target.measure((x, y, width, height, pageX, pageY) => {
        headerMeasures.current = {
          width,
          height,
          xLeft: Math.round(x + pageX),
          yTop: Math.round(y + pageY),
        };
      }),
    [],
  );

  const onModalLayout = useCallback(
    ({ target }) =>
      target.measure((x, y, width, height, pageX, pageY) => {
        modalMeasures.current = {
          width,
          height,
          xLeft: Math.round(x + pageX),
          yTop: Math.round(y + pageY),
        };
      }),
    [],
  );

  const onActionLayout = useCallback(
    ({ target }) =>
      target.measure((x, y, width, height, pageX, pageY) => {
        actionMeasures.current = {
          width,
          height,
          xLeft: Math.round(x + pageX),
          yTop: Math.round(y + pageY),
        };
      }),
    [],
  );

  const closeModalScaleX = childrenMeasures.current?.width / modalMeasures.current?.width || 1;
  const closeModalScaleY =
    childrenMeasures.current.height /
      (modalMeasures.current.height - headerMeasures.current.height) || 1;

  const closeScaleOffsetX = (modalMeasures.current.width - childrenMeasures.current.width) / 2;
  const closeScaleOffsetY = (modalMeasures.current.height - childrenMeasures.current.height) / 2;
  const headerScaleOffset = (headerMeasures.current.height * closeModalScaleY) / 2;

  const closeModalTopOffset =
    childrenMeasures.current.yTop - headerScaleOffset - closeScaleOffsetY + (offsets?.top || 0);
  const closeModalLeftOffset = childrenMeasures.current.xLeft - closeScaleOffsetX;

  const isLeft = childrenMeasures.current.xLeft <= w / 3;
  const isRight = childrenMeasures.current.xLeft + childrenMeasures.current.width >= (2 * w) / 3;

  const leftPosition = isLeft && margin;
  const middlePosition = !isLeft && !isRight && (w - modalMeasures.current.width) / 2;
  const rightPosition = isRight && w - margin - modalMeasures.current.width;

  const openModalTopOffset = Math.min(
    childrenMeasures.current.yTop + (offsets?.top || 0),
    h - modalMeasures.current.height - actionMeasures.current.height - margin - 100,
  );
  const openModalLeftOffset = leftPosition || rightPosition || middlePosition;

  const actionChildrenHorizontalOffset =
    (childrenMeasures.current.width - actionMeasures.current.width) / 2;

  const closeActionModalTopOffset =
    childrenMeasures.current.yTop +
    childrenMeasures.current.height -
    actionMeasures.current.height / 2 +
    (offsets?.top || 0);
  const closeActionModalLeftOffset =
    childrenMeasures.current.xLeft + actionChildrenHorizontalOffset;

  const leftActionPosition = isLeft && margin;
  const middleActionPosition = !isLeft && !isRight && (w - actionMeasures.current.width) / 2;
  const rightActionPosition = isRight && w - margin - actionMeasures.current.width;

  const openActionModalTopOffset = openModalTopOffset + modalMeasures.current.height + margin;
  const openActionModalLeftOffset =
    leftActionPosition || rightActionPosition || middleActionPosition;

  // console.log('children measures: ', childrenMeasures.current);
  // console.log('modal MEASURES: ', modalMeasures.current);
  // console.log('header measure: ', headerMeasures.current);
  // console.log('action measure: ', actionMeasures.current);
  // console.log('closeModalScaleY: ', closeModalScaleY);
  // console.log('openModalLeftOffset: ', openModalLeftOffset);
  // console.log('-------------');

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const actionTranslateY = useSharedValue(0);
  const actionTranslateX = useSharedValue(0);
  const actionScale = useSharedValue(1);
  const actionGestureTranslate = useSharedValue(0);

  const gestureTranslateX = useSharedValue(0);
  const gestureTranslateY = useSharedValue(0);
  const gestureScale = useSharedValue(1);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      gestureTranslateX.value = event.translationX;
      gestureTranslateY.value = event.translationY;
      gestureScale.value = withTiming(0.9, { duration: 200 * speed });
      actionGestureTranslate.value = withTiming(1, { duration: 200 * speed });
    },
    onEnd: (event) => {
      if (event.translationX > 100 || event.translationY > 100) {
        onClose();
      }
      gestureTranslateX.value = withTiming(0, { duration: 200 * speed });
      gestureTranslateY.value = withTiming(0, { duration: 200 * speed });
      gestureScale.value = withTiming(1, { duration: 200 * speed });
      actionGestureTranslate.value = withTiming(0, { duration: 200 * speed });
    },
  });

  const modalReanimatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value + gestureTranslateY.value },
        { translateX: translateX.value + gestureTranslateX.value },
        { scale: gestureScale.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    }),
    [],
  );

  const actionReanimatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [
        {
          translateY:
            actionTranslateY.value + gestureTranslateY.value - actionGestureTranslate.value * 20,
        },
        {
          translateX: actionTranslateX.value + gestureTranslateX.value,
        },
        { scale: actionScale.value },
      ],
    }),
    [],
  );

  const backdropReanimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalStyles = [S.container, modalReanimatedStyle];
  const actionStyles = [S.actionModal, actionReanimatedStyle];
  const backdropStyles = [S.backdrop, backdropReanimatedStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  /** @type {(visible: boolean) => void} */
  const animateModal = useCallback(
    (visible) => {
      const opacityValue = visible ? 1 : 0;
      const translateXValue = visible ? openModalLeftOffset : closeModalLeftOffset;
      const translateYValue = visible ? openModalTopOffset : closeModalTopOffset;
      const scaleXValue = visible ? 1 : closeModalScaleX;
      const scaleYValue = visible ? 1 : closeModalScaleY;

      opacity.value = withTiming(opacityValue, { duration: 400 * speed });
      translateX.value = withTiming(translateXValue, { duration: 300 * speed });
      translateY.value = withTiming(translateYValue, { duration: 300 * speed });
      scaleX.value = withTiming(scaleXValue, { duration: 300 * speed });
      scaleY.value = withTiming(scaleYValue, { duration: 300 * speed });

      if (actionModal) {
        const actionTranslateXValue = visible
          ? openActionModalLeftOffset
          : closeActionModalLeftOffset;
        const actionTranslateYValue = visible
          ? openActionModalTopOffset
          : closeActionModalTopOffset;
        const actionScaleValue = visible ? 1 : 0.5;

        actionTranslateX.value = withTiming(actionTranslateXValue, { duration: 300 * speed });
        actionTranslateY.value = withTiming(actionTranslateYValue, { duration: 300 * speed });
        actionScale.value = withTiming(actionScaleValue, { duration: 300 * speed });
      }
    },
    [
      actionModal,
      actionScale,
      actionTranslateX,
      actionTranslateY,
      closeActionModalLeftOffset,
      closeActionModalTopOffset,
      closeModalLeftOffset,
      closeModalScaleX,
      closeModalScaleY,
      closeModalTopOffset,
      opacity,
      openActionModalLeftOffset,
      openActionModalTopOffset,
      openModalLeftOffset,
      openModalTopOffset,
      scaleX,
      scaleY,
      translateX,
      translateY,
    ],
  );

  useEffect(() => animateModal(visible), [animateModal, visible]);

  return (
    <View onLayout={onChildrenLayout}>
      {children}
      <Portal>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={modalStyles} onLayout={onModalLayout} pointerEvents={pointerEvents}>
            {!!header && <View onLayout={onHeaderLayout} children={header} />}
            {modal}
          </Animated.View>
        </PanGestureHandler>
        {actionModal && (
          <Animated.View
            style={actionStyles}
            onLayout={onActionLayout}
            pointerEvents={pointerEvents}>
            {actionModal}
          </Animated.View>
        )}
        <Animated.View style={backdropStyles} pointerEvents={pointerEvents}>
          <TouchableOpacity
            style={S.backdrop}
            onPress={onClose}
            children={!!backdrop && backdrop}
          />
        </Animated.View>
      </Portal>
    </View>
  );
};

export default observer(PreviewModal);
