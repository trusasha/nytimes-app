import React, { useCallback, useState, useRef } from 'react';
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
  ];

  const renderItem = useCallback(
    ({ item, index }) => <HomeStoriesItem item={item} index={index} offset={scrollOffset} />,
    [scrollOffset],
  );

  const onScroll = useCallback(({ nativeEvent }) => {
    setScrollOffset(nativeEvent.contentOffset.y);
  }, []);

  const keyExtractor = useCallback(({ title }) => title, []);

  const navigate = useNavigate();

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
