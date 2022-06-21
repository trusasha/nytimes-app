import React, { useCallback, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import AnimatedModal from 'components/AnimatedModal';
import HomeStoryModal from '../HomeStoryModal';
import HomeStoryPreviewModal from '../HomeStoryPreviewModal';
import PreviewModal from 'components/PreviewModal';
import { ArrowBackIcon } from 'assets/svg';

/**
 * @typedef {{
 *  item: Story
 * }} HomeStoriesItemProps
 */

/**
 * @param {HomeStoriesItemProps} props
 */
const HomeStoriesItem = ({ item }) => {
  const { title, multimedia } = item;
  const T = configStore.localization;
  const S = useStyles();

  const [storyVisible, setStoryVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const image = { uri: multimedia?.[0]?.url };

  const onModalOpen = useCallback(() => setStoryVisible(true), []);
  const onModalClose = useCallback(() => setStoryVisible(false), []);

  const onPreviewOpen = useCallback(() => setPreviewVisible(true), []);
  const onPreviewClose = useCallback(() => setPreviewVisible(false), []);
  const onOpenFull = useCallback(() => {
    setPreviewVisible(false);
    setStoryVisible(true);
  }, []);

  const modal = useMemo(() => <HomeStoryModal item={item} />, [item]);
  const modalHeader = useMemo(
    () => (
      <View style={S.header}>
        <TouchableOpacity style={S.backButton} onPress={onModalClose}>
          <ArrowBackIcon {...S.backIconProps} />
        </TouchableOpacity>
        <Text style={S.headerTitle} children={title} numberOfLines={1} />
      </View>
    ),
    [S.backButton, S.backIconProps, S.header, S.headerTitle, onModalClose, title],
  );

  const preview = useMemo(() => <HomeStoryPreviewModal item={item} />, [item]);
  const previewHeader = useMemo(
    () => (
      <View style={S.header}>
        <Text style={S.headerTitle} children={title} numberOfLines={1} />
      </View>
    ),
    [S.header, S.headerTitle, title],
  );
  const previewActionModal = useMemo(
    () => (
      <View style={S.actionModal}>
        <TouchableOpacity style={S.actionButton} onPress={onOpenFull}>
          <Text style={S.actionText} children={T.openFull} />
        </TouchableOpacity>
        <TouchableOpacity style={S.actionButton} onPress={onPreviewClose}>
          <Text style={S.actionText} children={T.close} />
        </TouchableOpacity>
      </View>
    ),
    [S.actionButton, S.actionModal, S.actionText, T.close, T.openFull, onOpenFull, onPreviewClose],
  );

  return (
    <View style={S.container}>
      <PreviewModal
        visible={previewVisible}
        setVisible={setPreviewVisible}
        actionModal={previewActionModal}
        modal={preview}
        header={previewHeader}>
        <AnimatedModal
          visible={storyVisible}
          setVisible={setStoryVisible}
          modal={modal}
          modalContainerStyle={S.modalContainer}
          header={modalHeader}>
          <TouchableOpacity
            style={S.itemContainer}
            onPress={onModalOpen}
            onLongPress={onPreviewOpen}
            delayLongPress={300}>
            <Image style={S.image} source={image} />
          </TouchableOpacity>
        </AnimatedModal>
      </PreviewModal>
    </View>
  );
};

export default observer(HomeStoriesItem);
