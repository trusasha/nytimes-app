import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';

const HomeHeaderActions = ({}) => {
  const S = useStyles();
  const T = configStore.localization;

  return (
    <View style={S.container}>
      <Text style={S.title} children={T.theNewYorkTimesApp} />
    </View>
  );
};

export default observer(HomeHeaderActions);
