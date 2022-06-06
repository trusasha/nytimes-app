import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { configStore, storiesStore } from 'stores';
import useNavigate from 'hooks/useNavigate';
import HomeStoriesItem from './HomeStoriesItem';
import AnimatedModal from 'components/AnimatedModal';
import { PortalProvider } from '@gorhom/portal';

const Home = () => {
  const S = useStyles();
  const T = configStore.localization;
  const R = configStore.routeNameLocalization;

  const data = storiesStore.mockData.results;

  const renderItem = useCallback(({ item }) => <HomeStoriesItem item={item} />, []);

  const keyExtractor = useCallback(({ title }) => title, []);

  const navigate = useNavigate();

  return (
    <PortalProvider>
      <View style={S.container}>
        <FlatList
          contentContainerStyle={S.contentContainer}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={data}
        />
      </View>
    </PortalProvider>
  );
};

export default observer(Home);
