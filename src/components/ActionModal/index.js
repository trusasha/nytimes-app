import React, { useRef, useEffect, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSpecialStyleProps } from 'hooks/newUseStyles';

const minimalVerticalOffset = 8;
const minimalHorizontalOffset = 12;

/**
 * @typedef {{
 * xLeft: number
 * xRight: number
 * yTop: number
 * yBottom: number
 * horizontalOffsets: number
 * }} Measures
 */

/** @type {Measures} */
const initialMeasures = {
  xLeft: 0,
  xRight: 0,
  yTop: 0,
  yBottom: 0,
  horizontalOffsets: 0,
};

/**
 * @typedef {{
 *  visible: boolean
 *  setVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  children: JSX.Element
 *  modalComponent: JSX.Element
 *  offset?: number
 * }} ActionModalProps
 */

/**
 * @param {ActionModalProps} props
 */
const ActionModal = ({ visible, setVisible, children, offset, modalComponent }) => {
  const S = useStyles();
  const { w, h } = useSpecialStyleProps();

  const [measures, setMeasures] = useState(initialMeasures);

  /** @type {React.MutableRefObject<import('react-native').LayoutRectangle>} */
  const childrenLayout = useRef(null);
  /** @type {React.MutableRefObject<import('react-native').LayoutRectangle>} */
  const modalLayout = useRef(null);
  /** @type {React.MutableRefObject<Measures>} */
  const childrenLayoutMeasures = useRef(null);

  /** @type {React.MutableRefObject<View>} */
  const childrenRef = useRef(null);

  /** @type {React.MutableRefObject<Animated.View>} */
  const modalRef = useRef(null);

  const modalTopOffset = (childrenLayout?.current?.height || 0) + (offset || minimalVerticalOffset);
  const modalSideOffset =
    measures.xRight < minimalHorizontalOffset
      ? -measures.horizontalOffsets
      : measures.xLeft < minimalHorizontalOffset
      ? measures.horizontalOffsets
      : 0;

  useEffect(() => {
    if (
      visible &&
      modalLayout.current &&
      childrenLayout.current &&
      childrenLayoutMeasures.current
    ) {
      const horizontalOffsets = (modalLayout.current.width - childrenLayout.current.width) / 2;

      setMeasures({
        xLeft:
          childrenLayoutMeasures.current.xLeft - childrenLayout.current.width - horizontalOffsets,
        xRight: childrenLayoutMeasures.current.xRight - horizontalOffsets,
        yTop: 0,
        yBottom: 0,
        horizontalOffsets: horizontalOffsets,
      });
    }
  }, [visible]);

  const progress = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(
    () => ({
      opacity: progress.value,
      transform: [
        { scale: progress.value },
        { translateY: progress.value * modalTopOffset },
        { translateX: progress.value * modalSideOffset },
      ],
    }),
    [modalTopOffset, modalSideOffset],
  );

  const modalStyles = [S.container, reanimatedStyle];
  const pointerEvents = visible ? 'auto' : 'none';

  /** @type {(event: import('react-native').LayoutChangeEvent) => void} */
  const onChildrenLayout = useCallback(({ nativeEvent }) => {
    childrenLayout.current = nativeEvent.layout;
  }, []);

  /** @type {(event: import('react-native').LayoutChangeEvent) => void} */
  const onModalLayout = useCallback(
    ({ nativeEvent, target }) => {
      modalLayout.current = nativeEvent.layout;
      // @ts-ignore
      target.measure((x, y, width, height, pageX, pageY) => {
        childrenLayoutMeasures.current = {
          xLeft: Math.round(x + pageX),
          xRight: w - Math.round(x + pageX),
          yTop: Math.round(y + pageY),
          yBottom: Math.round(y + pageY) - h,
          horizontalOffsets: 0,
        };
      });
    },
    [h, w],
  );

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 150 });
  }, [progress, visible]);

  return (
    <View ref={childrenRef} onLayout={onChildrenLayout}>
      {children}
      <Animated.View
        style={modalStyles}
        ref={modalRef}
        pointerEvents={pointerEvents}
        onLayout={onModalLayout}>
        {modalComponent}
      </Animated.View>
      {visible && <TouchableOpacity style={S.backdrop} onPress={onClose} />}
    </View>
  );
};

export default observer(ActionModal);
