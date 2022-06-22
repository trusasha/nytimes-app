import React, { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSpecialStyleProps } from 'hooks/newUseStyles';
import { Portal } from '@gorhom/portal';

const offset = 12;

/**
 * @typedef {{
 * translateX: number
 * translateY: number
 * scale: number
 * }} ModalPosition
 */

/**
 * @typedef {{
 *  visible: boolean
 *  setVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  children: JSX.Element
 *  modalComponent: JSX.Element
 * }} ActionModalProps
 */

/**
 * @param {ActionModalProps} props
 */
const ActionModal = ({ visible, setVisible, children, modalComponent }) => {
  const S = useStyles();
  const { w } = useSpecialStyleProps();

  /** @type {React.RefObject<View>} */
  const childrenMeasures = useAnimatedRef();
  /** @type {React.RefObject<Animated.View>} */
  const modalMeasures = useAnimatedRef();

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const reanimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const modalStyles = [S.container, reanimatedStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  const getOpenParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} modalMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, modalMeasures) => {
      'worklet';

      const horizontalOffsets = (modalMeasures.width - childrenMeasures.width) / 2;

      const isRight = childrenMeasures.pageX - horizontalOffsets + modalMeasures.width > w;
      const isLeft = childrenMeasures.pageX - horizontalOffsets < 0;

      const rightPosition = isRight && w - modalMeasures.width - offset;
      const leftPosition = isLeft && offset;
      const normalPosition = childrenMeasures.pageX - horizontalOffsets;

      const translateX = rightPosition || leftPosition || normalPosition;
      const translateY = childrenMeasures.pageY + childrenMeasures.height + offset;

      return { translateX, translateY, scale: 1 };
    },
    [w],
  );

  const getCloseParameters = useCallback(
    /**
     * @param {import('components/AnimatedModal').Measures} childrenMeasures
     * @param {import('components/AnimatedModal').Measures} modalMeasures
     * @return {ModalPosition}
     */
    (childrenMeasures, modalMeasures) => {
      'worklet';

      const scaleHorizontalOffset = (modalMeasures.width - childrenMeasures.width) / 2;

      const translateX = childrenMeasures.pageX - scaleHorizontalOffset;
      const translateY = childrenMeasures.pageY;
      const scale = childrenMeasures.width / modalMeasures.width || 1;
      return { translateX, translateY, scale };
    },
    [],
  );

  const showModal = useCallback(() => {
    runOnUI(() => {
      'worklet';
      try {
        const children = measure(childrenMeasures);
        const modal = measure(modalMeasures);

        const openParameters = getOpenParameters(children, modal);
        const closeParameters = getCloseParameters(children, modal);

        translateX.value = closeParameters.translateX;
        translateY.value = closeParameters.translateY;
        scale.value = closeParameters.scale;

        translateX.value = withTiming(openParameters.translateX, { duration: 300 });
        translateY.value = withTiming(openParameters.translateY, { duration: 300 });
        scale.value = withTiming(openParameters.scale, { duration: 300 });
        opacity.value = withTiming(1, { duration: 300 });
      } catch {}
    })();
  }, [
    childrenMeasures,
    getCloseParameters,
    getOpenParameters,
    modalMeasures,
    opacity,
    scale,
    translateX,
    translateY,
  ]);

  const hideModal = useCallback(() => {
    runOnUI(() => {
      'worklet';

      try {
        const children = measure(childrenMeasures);
        const modal = measure(modalMeasures);

        const closeParameters = getCloseParameters(children, modal);

        opacity.value = withTiming(0, { duration: 300 });
        translateX.value = withTiming(closeParameters.translateX, { duration: 300 });
        translateY.value = withTiming(closeParameters.translateY, { duration: 300 });
        scale.value = withTiming(closeParameters.scale, { duration: 300 }, () => {
          scale.value = 1;
        });
      } catch {}
    })();
  }, [childrenMeasures, getCloseParameters, modalMeasures, opacity, scale, translateX, translateY]);

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  useEffect(() => (visible ? showModal() : hideModal()), [hideModal, showModal, visible]);

  return (
    <View ref={childrenMeasures}>
      {children}
      <Portal hostName="animated-modal-provider">
        <Animated.View style={modalStyles} ref={modalMeasures} pointerEvents={pointerEvents}>
          {modalComponent}
        </Animated.View>
        {visible && <TouchableOpacity style={S.backdrop} onPress={onClose} />}
      </Portal>
    </View>
  );
};

export default observer(ActionModal);
