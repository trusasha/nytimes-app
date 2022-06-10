import React, { useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Text } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';
import { useSpecialStyleProps } from 'hooks/newUseStyles';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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

  const reanimatedStyle = useAnimatedStyle(
    () => ({
      height: height.value,
      opacity: opacity.value,
      transform: [
        { translateY: translate.value * modalTopOffset },
        { translateX: translate.value * modalLeftOffset },
        { scaleX: scaleX.value },
      ],
    }),
    [modalTopOffset, modalLeftOffset],
  );

  const modalStyles = [S.container, reanimatedStyle];
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
        <Animated.View style={modalStyles} pointerEvents={pointerEvents}>
          <View style={S.header}>
            <TouchableOpacity style={S.backButton} onPress={onClose} />
            {!!title && <Text style={S.title} children={title} />}
          </View>
          {modal}
        </Animated.View>
      </Portal>
    </View>
  );
};

export default observer(AnimatedModal);
