import React, { useRef, useCallback, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import dayjs from 'dayjs';
import AnimatedModal from 'components/AnimatedModal';
import HomeStoryModal from '../HomeStoryModal';
import HomeStoryPreviewModal from '../HomeStoryPreviewModal';

/**
 * @typedef {{
 *  item: Story
 *  offset: number
 * }} HomeStoriesItemProps
 */

/**
 * @param {HomeStoriesItemProps} props
 */
const HomeStoriesItem = ({ item, offset }) => {
  const { title, byline, created_date, multimedia } = item;
  const T = configStore.localization;
  const S = useStyles();

  const [storyVisible, setStoryVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  /** @type {React.MutableRefObject<TouchableOpacity>} */
  const ref = useRef(null);

  const image = { uri: multimedia?.[0]?.url };
  const timeFrom = `${T.published}: ${dayjs(created_date).fromNow()}`;

  const onModalOpen = useCallback(() => setStoryVisible(true), []);
  const onModalClose = useCallback(() => setStoryVisible(false), []);

  const onPreviewOpen = useCallback(() => setPreviewVisible(true), []);
  const onPreviewClose = useCallback(() => setPreviewVisible(false), []);

  const modal = useMemo(() => <HomeStoryModal item={item} />, [item]);
  const modalHeader = useMemo(
    () => (
      <View style={S.header}>
        <TouchableOpacity style={S.backButton} onPress={onModalClose} />
        <Text style={S.headerTitle} children={title} numberOfLines={1} />
      </View>
    ),
    [S.backButton, S.header, S.headerTitle, onModalClose, title],
  );

  const preview = useMemo(() => <HomeStoryPreviewModal item={item} />, [item]);

  const offsets = { top: -offset };

  return (
    <View style={S.container}>
      <AnimatedModal
        visible={previewVisible}
        setVisible={setPreviewVisible}
        modal={preview}
        offsets={offsets}>
        <AnimatedModal
          visible={storyVisible}
          setVisible={setStoryVisible}
          modal={modal}
          header={modalHeader}
          offsets={offsets}>
          <TouchableOpacity
            ref={ref}
            style={S.itemContainer}
            onPress={onModalOpen}
            onLongPress={onPreviewOpen}
            delayLongPress={300}>
            <Image style={S.image} source={image} />
            {/* <View style={S.content}>
              <Text style={S.title} children={title} numberOfLines={2} />
              <Text style={S.byline} children={byline} numberOfLines={2} />
              <Text style={S.published} children={timeFrom} numberOfLines={2} />
            </View> */}
          </TouchableOpacity>
        </AnimatedModal>
      </AnimatedModal>
    </View>
  );
};

export default observer(HomeStoriesItem);
