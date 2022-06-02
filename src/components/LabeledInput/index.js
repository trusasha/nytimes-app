import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, TextInput, Text } from 'react-native';
import useStyles from './useStyles';

/**
 * @typedef {{
 * label?: string
 * containerStyle?: import('react-native').ViewStyle
 * textStyle?: import('react-native').TextStyle
 * labelStyle?: import('react-native').TextStyle
 * }} LabeledInputProps
 */

/**
 * @param {LabeledInputProps & import('react-native').TextInputProps} props
 */
const LabeledInput = ({ label, containerStyle, textStyle, labelStyle, ...rest }) => {
  const S = useStyles({ containerStyle, textStyle, labelStyle });

  return (
    <View style={S.container}>
      {!!label && <Text style={S.label}>{label}</Text>}
      <TextInput style={S.textInput} {...rest} />
    </View>
  );
};

export default observer(LabeledInput);
