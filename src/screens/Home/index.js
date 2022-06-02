import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import useNavigate from 'hooks/useNavigate';

const Home = () => {
  const S = useStyles();
  const T = configStore.localization;
  const R = configStore.routeNameLocalization;

  const navigate = useNavigate();

  return (
    <View style={S.container}>
      <Text>Home</Text>
    </View>
  );
};

export default observer(Home);
