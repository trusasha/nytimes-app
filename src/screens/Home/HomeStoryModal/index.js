import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, ScrollView } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';

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
  const T = configStore.localization;

  const image = { uri: multimedia[0].url };

  return (
    <ScrollView contentContainerStyle={S.container} showsVerticalScrollIndicator={false}>
      <View style={S.sectionContainer}>
        <Text style={S.section} children={section} />
        {!!subsection && <Text style={S.section} children={subsection} />}
      </View>
      <Text style={S.title} children={title} />
      <Text style={S.byline} children={byline} />
      <Text style={S.abstract} children={abstract} />
      <Image style={S.image} source={image} />
      <Text style={S.abstract} children={T.lorem} />
      <Text style={S.abstract} children={T.lorem} />
      <Text style={S.abstract} children={T.lorem} />
    </ScrollView>
  );
};

export default observer(HomeStoryModal);
