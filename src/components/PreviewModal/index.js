import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';
import { PanGestureHandler } from 'react-native-gesture-handler';
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
import { useSpecialStyleProps } from 'hooks/newUseStyles';

/**
 * @typedef {{
 * translateX: number
 * translateY: number
 * scaleX?: number
 * scaleY?: number
 * scale?: number
 * }} ModalPosition
 */

/**
 * @typedef {{
 *  actionModal?: JSX.Element
 * }} PreviewModalProps
 */

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
  backdropStyles,
  header,
  offsets,
}) => {
  const { w, h } = useSpecialStyleProps();
  const S = useStyles({ modalContainerStyle, backdropStyles });

  /** @type {React.RefObject<View>} */
  const childrenMeasures = useAnimatedRef();
  /** @type {React.RefObject<View>} */
  const headerMeasures = useAnimatedRef();
  /** @type {React.LegacyRef<Animated.View>} */
  const modalMeasures = useAnimatedRef();
  /** @type {React.LegacyRef<Animated.View>} */
  const actionMeasures = useAnimatedRef();

  const haveActionModal = !!actionModal;

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const backdropOpacity = useSharedValue(0);

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
      if (
        event.translationX > 100 ||
        event.translationX < -100 ||
        event.translationY > 100 ||
        event.translationY < -100
      ) {
        runOnJS(onClose)();
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
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyles = [S.container, modalReanimatedStyle];
  const actionAnimatedStyles = [S.actionModal, actionReanimatedStyle];
  const backdropAnimatedStyles = [S.backdrop, backdropReanimatedStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  const getModalCloseParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} modalMeasures
     * @param {import('components/AnimatedModal').Measures} headerMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, modalMeasures, headerMeasures) => {
      'worklet';

      const closeScaleOffsetX = (modalMeasures.width - childrenMeasures.width) / 2;
      const closeScaleOffsetY = (modalMeasures.height - childrenMeasures.height) / 2;

      const closeModalScaleY =
        childrenMeasures.height / (modalMeasures.height - headerMeasures.height) || 1;
      const headerScaleOffset = (headerMeasures.height * closeModalScaleY) / 2;

      const translateX = childrenMeasures.pageX - closeScaleOffsetX;
      const translateY =
        childrenMeasures.pageY - headerScaleOffset - closeScaleOffsetY + (offsets?.top || 0);
      const scaleX = childrenMeasures.width / modalMeasures.width || 1;
      const scaleY = closeModalScaleY;

      return { translateX, translateY, scaleX, scaleY };
    },
    [offsets?.top],
  );

  const getModalOpenParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} modalMeasures
     * @param {import('components/AnimatedModal').Measures} actionMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, modalMeasures, actionMeasures) => {
      'worklet';

      const isLeft = childrenMeasures.pageX <= w / 3;
      const isRight = childrenMeasures.pageX + childrenMeasures.width >= (2 * w) / 3;

      const leftPosition = isLeft && margin;
      const middlePosition = !isLeft && !isRight && (w - modalMeasures.width) / 2;
      const rightPosition = isRight && w - margin - modalMeasures.width;

      const translateX = leftPosition || rightPosition || middlePosition;
      const translateY = Math.min(
        childrenMeasures.pageY + (offsets?.top || 0),
        h - modalMeasures.height - actionMeasures.height - margin - 100,
      );
      const scaleX = 1;
      const scaleY = 1;

      return { translateX, translateY, scaleX, scaleY };
    },
    [h, offsets?.top, w],
  );

  const getActionCloseParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} actionMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, actionMeasures) => {
      'worklet';

      const actionChildrenHorizontalOffset = (childrenMeasures.width - actionMeasures.width) / 2;
      const translateX = childrenMeasures.pageX + actionChildrenHorizontalOffset;
      const translateY =
        childrenMeasures.pageY +
        childrenMeasures.height -
        actionMeasures.height / 2 +
        (offsets?.top || 0);

      const scale = 0;

      return { translateX, translateY, scale };
    },
    [offsets?.top],
  );

  const getActionOpenParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} modalMeasures
     * @param {import('components/AnimatedModal').Measures} actionMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, modalMeasures, actionMeasures) => {
      'worklet';

      const isLeft = childrenMeasures.pageX <= w / 3;
      const isRight = childrenMeasures.pageX + childrenMeasures.width >= (2 * w) / 3;

      const openModalTopOffset = Math.min(
        childrenMeasures.pageY + (offsets?.top || 0),
        h - modalMeasures.height - actionMeasures.height - margin - 100,
      );

      const leftActionPosition = isLeft && margin;
      const middleActionPosition = !isLeft && !isRight && (w - actionMeasures.width) / 2;
      const rightActionPosition = isRight && w - margin - actionMeasures.width;

      const translateY = openModalTopOffset + modalMeasures.height + margin;
      const translateX = leftActionPosition || rightActionPosition || middleActionPosition;

      const scale = 1;

      return { translateX, translateY, scale };
    },
    [h, offsets?.top, w],
  );

  const showModal = useCallback(() => {
    runOnUI(() => {
      'worklet';

      try {
        scaleX.value = 1;
        scaleY.value = 1;

        const children = measure(childrenMeasures);
        const modal = measure(modalMeasures);
        const header = measure(headerMeasures);
        const action = measure(actionMeasures);

        const startPosition = getModalCloseParameters(children, modal, header);
        const finishPosition = getModalOpenParameters(children, modal, action);

        translateX.value = startPosition.translateX;
        translateY.value = startPosition.translateY;
        scaleX.value = startPosition.scaleX;
        scaleY.value = startPosition.scaleY;
        opacity.value = 1;

        backdropOpacity.value = withTiming(1, { duration: 300 * speed });
        translateX.value = withTiming(finishPosition.translateX, { duration: 300 * speed });
        translateY.value = withTiming(finishPosition.translateY, { duration: 300 * speed });
        scaleX.value = withTiming(finishPosition.scaleX, { duration: 300 * speed });
        scaleY.value = withTiming(finishPosition.scaleY, { duration: 300 * speed });

        if (haveActionModal) {
          const actionStartPosition = getActionCloseParameters(children, action);
          const actionFinishPosition = getActionOpenParameters(children, modal, action);
          actionTranslateX.value = actionStartPosition.translateX;
          actionTranslateY.value = actionStartPosition.translateY;
          actionScale.value = actionStartPosition.scale;
          actionTranslateX.value = withTiming(actionFinishPosition.translateX, {
            duration: 300 * speed,
          });
          actionTranslateY.value = withTiming(actionFinishPosition.translateY, {
            duration: 300 * speed,
          });
          actionScale.value = withTiming(actionFinishPosition.scale, {
            duration: 300 * speed,
          });
        }
      } catch {}
    })();
  }, [
    actionMeasures,
    actionScale,
    actionTranslateX,
    actionTranslateY,
    backdropOpacity,
    childrenMeasures,
    getActionCloseParameters,
    getActionOpenParameters,
    getModalCloseParameters,
    getModalOpenParameters,
    haveActionModal,
    headerMeasures,
    modalMeasures,
    opacity,
    scaleX,
    scaleY,
    translateX,
    translateY,
  ]);

  const hideModal = useCallback(() => {
    runOnUI(() => {
      'worklet';

      try {
        const children = measure(childrenMeasures);
        const modal = measure(modalMeasures);
        const header = measure(headerMeasures);
        const action = measure(actionMeasures);

        const startPosition = getModalCloseParameters(children, modal, header);

        opacity.value = withTiming(0);
        backdropOpacity.value = withTiming(0, { duration: 300 * speed });
        translateX.value = withTiming(startPosition.translateX, { duration: 300 * speed });
        translateY.value = withTiming(startPosition.translateY, { duration: 300 * speed });
        scaleX.value = withTiming(startPosition.scaleX, { duration: 300 * speed }, () => {
          scaleX.value = 1;
        });
        scaleY.value = withTiming(startPosition.scaleY, { duration: 300 * speed }, () => {
          scaleY.value = 1;
        });

        if (haveActionModal) {
          const actionStartPosition = getActionCloseParameters(children, action);
          actionTranslateX.value = withTiming(actionStartPosition.translateX, {
            duration: 300 * speed,
          });
          actionTranslateY.value = withTiming(actionStartPosition.translateY, {
            duration: 300 * speed,
          });
          actionScale.value = withTiming(
            actionStartPosition.scale,
            {
              duration: 300 * speed,
            },
            () => {
              actionScale.value = 1;
            },
          );
        }
      } catch {}
    })();
  }, [
    actionMeasures,
    actionScale,
    actionTranslateX,
    actionTranslateY,
    backdropOpacity,
    childrenMeasures,
    getActionCloseParameters,
    getModalCloseParameters,
    haveActionModal,
    headerMeasures,
    modalMeasures,
    opacity,
    scaleX,
    scaleY,
    translateX,
    translateY,
  ]);

  useEffect(() => (visible ? showModal() : hideModal()), [hideModal, showModal, visible]);

  return (
    <View ref={childrenMeasures}>
      {children}
      <Portal>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View
            style={modalAnimatedStyles}
            ref={modalMeasures}
            pointerEvents={pointerEvents}>
            {!!header && <View ref={headerMeasures} children={header} />}
            {modal}
          </Animated.View>
        </PanGestureHandler>
        {actionModal && (
          <Animated.View
            ref={actionMeasures}
            style={actionAnimatedStyles}
            pointerEvents={pointerEvents}>
            {actionModal}
          </Animated.View>
        )}
        <Animated.View style={backdropAnimatedStyles} pointerEvents={pointerEvents}>
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
