import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Image } from 'react-native';
import useStyles from './useStyles';
import ActionModal from 'components/ActionModal';

/**
 * @typedef {{
 *  item: Story
 * }} HomeStoryPreviewModalProps
 */

/**
 * @param {HomeStoryPreviewModalProps} props
 */
const HomeStoryPreviewModal = ({ item }) => {
  const { multimedia } = item;
  const S = useStyles();

  const image = { uri: multimedia[0].url };

  return (
    <View style={S.container}>
      <Image style={S.image} source={image} />
    </View>
  );
};

export default observer(HomeStoryPreviewModal);
