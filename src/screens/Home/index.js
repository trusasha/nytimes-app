import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, FlatList } from 'react-native';
import useStyles from './useStyles';
import { storiesStore } from 'stores';
import HomeStoriesItem from './HomeStoriesItem';
import { PortalProvider } from '@gorhom/portal';

const Home = () => {
  const S = useStyles();

  const [scrollOffset, setScrollOffset] = useState(0);

  const data = [
    storiesStore.mockData.results[0],
    storiesStore.mockData.results[1],
    storiesStore.mockData.results[2],
    storiesStore.mockData.results[3],
    storiesStore.mockData.results[4],
    storiesStore.mockData.results[5],
    storiesStore.mockData.results[6],
    storiesStore.mockData.results[7],
    storiesStore.mockData.results[8],
    storiesStore.mockData.results[9],
    storiesStore.mockData.results[10],
    storiesStore.mockData.results[11],
    storiesStore.mockData.results[12],
    storiesStore.mockData.results[13],
    storiesStore.mockData.results[14],
    storiesStore.mockData.results[15],
    storiesStore.mockData.results[16],
    storiesStore.mockData.results[17],
    storiesStore.mockData.results[18],
  ];

  const renderItem = useCallback(
    ({ item }) => <HomeStoriesItem item={item} offset={scrollOffset} />,
    [scrollOffset],
  );

  const onScroll = useCallback(({ nativeEvent }) => {
    setScrollOffset(nativeEvent.contentOffset.y);
  }, []);

  const keyExtractor = useCallback(({ title }) => title, []);

  return (
    <View style={S.container}>
      <PortalProvider>
        <FlatList
          contentContainerStyle={S.contentContainer}
          scrollEventThrottle={32}
          onScroll={onScroll}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={data}
        />
      </PortalProvider>
    </View>
  );
};

export default observer(Home);
