import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, FlatList } from 'react-native';
import useStyles from './useStyles';
import { storiesStore } from 'stores';
import HomeStoriesItem from './HomeStoriesItem';
import { PortalProvider } from '@gorhom/portal';
import HomeHeaderActions from './HomeHeaderActions';

const Home = () => {
  const S = useStyles();

  const renderItem = useCallback(({ item }) => <HomeStoriesItem item={item} />, []);

  const keyExtractor = useCallback(({ title }) => title, []);

  const ListHeaderComponent = useMemo(() => <HomeHeaderActions />, []);

  return (
    <View style={S.container}>
      <PortalProvider>
        <FlatList
          contentContainerStyle={S.contentContainer}
          scrollEventThrottle={32}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={storiesStore.mockData.results}
          ListHeaderComponent={ListHeaderComponent}
        />
      </PortalProvider>
    </View>
  );
};

export default observer(Home);
