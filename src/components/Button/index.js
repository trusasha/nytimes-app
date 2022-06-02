import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Text } from 'react-native';
import useStyles from './useStyles';

/**
 * @typedef {{
 *  title: string
 *  disabled?: boolean
 *  textStyle?: import('react-native').TextStyle
 * }} ButtonProps
 */

/**
 * @param {ButtonProps & import('react-native').TouchableOpacityProps} props
 */
const Button = ({ title, textStyle, disabled, ...rest }) => {
  const S = useStyles({ textStyle, disabled });

  return (
    <TouchableOpacity disabled={disabled} style={S.container} {...rest}>
      <Text style={S.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default observer(Button);
