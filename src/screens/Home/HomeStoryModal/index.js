import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, ScrollView } from 'react-native';
import useStyles from './useStyles';
import AnimatedModal from 'components/AnimatedModal';

/**
 * @typedef {{
 *  item: Story
 * }} HomeStoryModalProps
 */

/**
 * @param {HomeStoryModalProps} props
 */
const HomeStoryModal = ({ item }) => {
  const { title, multimedia, abstract, byline, section, subsection } = item;
  const S = useStyles();

  const images = multimedia.map((item) => ({ uri: item.url }));

  return (
    <ScrollView contentContainerStyle={S.container} showsVerticalScrollIndicator={false}>
      <View style={S.sectionContainer}>
        <Text style={S.section} children={section} />
        {!!subsection && <Text style={S.section} children={subsection} />}
      </View>
      <Text style={S.title} children={title} />
      <Text style={S.byline} children={byline} />
      <Text style={S.abstract} children={abstract} />
      {!!images.length &&
        images.map((item, index) => <Image style={S.image} source={item} key={`${index}`} />)}
    </ScrollView>
  );
};

export default observer(HomeStoryModal);
