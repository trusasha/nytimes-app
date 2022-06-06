import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Text } from 'react-native';
import useStyles from './useStyles';
import { Portal } from '@gorhom/portal';

/**
 * @typedef {{
 *  visible: boolean
 *  setVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  title?: string
 *  children: JSX.Element
 * }} AnimatedModalProps
 */

/**
 * @param {AnimatedModalProps} props
 */
const AnimatedModal = ({ visible, setVisible, title, children }) => {
  const S = useStyles();

  const onClose = useCallback(() => setVisible(false), [setVisible]);

  return visible ? (
    <Portal>
      <View style={S.container}>
        <View style={S.header}>
          <TouchableOpacity style={S.backButton} onPress={onClose} />
          {!!title && <Text style={S.title} children={title} />}
        </View>
        {children}
      </View>
    </Portal>
  ) : null;
};

export default observer(AnimatedModal);
