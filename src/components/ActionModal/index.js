import React, { useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';

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
  /** @type {React.MutableRefObject<import('react-native').LayoutRectangle>} */
  const childrenLayout = useRef(null);
  /** @type {React.MutableRefObject<import('react-native').LayoutRectangle>} */
  const modalLayout = useRef(null);

  const rightPosition =
    ((modalLayout?.current?.width || 0) - (childrenLayout?.current?.width || 0)) / -2;

  const S = useStyles({ childrenLayout: childrenLayout?.current, offset });

  /** @type {React.MutableRefObject<View>} */
  const childrenRef = useRef(null);

  /** @type {React.MutableRefObject<View>} */
  const modalRef = useRef(null);

  /** @type {(event: import('react-native').LayoutChangeEvent) => void} */
  const onChildrenLayout = useCallback(({ nativeEvent }) => {
    childrenLayout.current = nativeEvent.layout;
    console.log('LOG CHILDREN: ', nativeEvent);
  }, []);

  /** @type {(event: import('react-native').LayoutChangeEvent) => void} */
  const onModalLayout = useCallback(({ nativeEvent }) => {
    modalLayout.current = nativeEvent.layout;
    console.log('LOG MODAL: ', nativeEvent);
  }, []);

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  useEffect(() => {}, []);

  return (
    <View ref={childrenRef} onLayout={onChildrenLayout}>
      {children}
      {visible && (
        <>
          <View style={S.container} ref={modalRef} onLayout={onModalLayout}>
            {modalComponent}
          </View>
          <TouchableOpacity style={S.backdrop} onPress={onClose} />
        </>
      )}
    </View>
  );
};

export default observer(ActionModal);
