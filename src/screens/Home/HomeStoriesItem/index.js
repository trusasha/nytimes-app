import React, { useRef, useCallback, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import dayjs from 'dayjs';
import AnimatedModal from 'components/AnimatedModal';
import HomeStoryModal from '../HomeStoryModal';

/**
 * @typedef {{
 *  item: Story
 *  index: number
 *  offset: number
 * }} HomeStoriesItemProps
 */

/**
 * @param {HomeStoriesItemProps} props
 */
const HomeStoriesItem = ({ item, index, offset }) => {
  const { title, byline, created_date, multimedia } = item;
  const T = configStore.localization;
  const S = useStyles();

  const [storyVisible, setStoryVisible] = useState(false);

  /** @type {React.MutableRefObject<TouchableOpacity>} */
  const ref = useRef(null);

  const image = { uri: multimedia?.[0]?.url };
  const timeFrom = `${T.published}: ${dayjs(created_date).fromNow()}`;

  /** @type {(item: Story, ref: React.MutableRefObject<TouchableOpacity>) => void} */
  const onOpenModal = useCallback((item, ref) => {
    setStoryVisible(true);
  }, []);

  const onPress = useCallback(() => onOpenModal(item, ref), [item, onOpenModal]);

  const modal = useMemo(() => <HomeStoryModal item={item} />, [item]);

  const offsets = { top: -offset };

  return (
    <View style={S.container}>
      <AnimatedModal
        visible={storyVisible}
        setVisible={setStoryVisible}
        modal={modal}
        offsets={offsets}>
        <TouchableOpacity ref={ref} style={S.itemContainer} onPress={onPress}>
          <Image style={S.image} source={image} />
          {/* <View style={S.content}>
            <Text style={S.title} children={title} numberOfLines={2} />
            <Text style={S.byline} children={byline} numberOfLines={2} />
            <Text style={S.published} children={timeFrom} numberOfLines={2} />
          </View> */}
        </TouchableOpacity>
      </AnimatedModal>
    </View>
  );
};

export default observer(HomeStoriesItem);
