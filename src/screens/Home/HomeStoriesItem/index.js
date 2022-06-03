import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import dayjs from 'dayjs';

/**
 * @typedef {{
 *  item: Story
 * }} HomeStoriesItemProps
 */

/**
 * @param {HomeStoriesItemProps} props
 */
const HomeStoriesItem = ({ item }) => {
  const { title, byline, created_date, multimedia } = item;
  const T = configStore.localization;
  const S = useStyles();

  const image = { uri: multimedia?.[0]?.url };
  const timeFrom = `${T.published}: ${dayjs(created_date).fromNow()}`;

  return (
    <View style={S.container}>
      <Image style={S.image} source={image} />
      <View style={S.content}>
        <Text style={S.title} children={title} numberOfLines={2} />
        <Text style={S.byline} children={byline} numberOfLines={2} />
        <Text style={S.published} children={timeFrom} numberOfLines={2} />
      </View>
    </View>
  );
};

export default observer(HomeStoriesItem);
