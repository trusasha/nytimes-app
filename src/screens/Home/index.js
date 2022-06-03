import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList } from 'react-native';
import useStyles from './useStyles';
import { configStore, storiesStore } from 'stores';
import useNavigate from 'hooks/useNavigate';
import HomeStoriesItem from './HomeStoriesItem';

const Home = () => {
  const S = useStyles();
  const T = configStore.localization;
  const R = configStore.routeNameLocalization;

  const data = storiesStore.mockData.results;

  const renderItem = useCallback(({ item }) => <HomeStoriesItem item={item} />, []);

  const keyExtractor = useCallback(({ title }) => title, []);

  const navigate = useNavigate();

  return (
    <View style={S.container}>
      <FlatList
        contentContainerStyle={S.contentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={data}
      />
    </View>
  );
};

export default observer(Home);
