import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import { configStore } from 'stores';
import ActionModal from 'components/ActionModal';
import { MenuBurgerIcon } from 'assets/svg';

const HomeHeaderActions = ({}) => {
  const S = useStyles();
  const T = configStore.localization;

  const [actionVisible, setActionVisible] = useState(false);

  const onAction = useCallback(() => setActionVisible(true), []);

  const actionModal = useMemo(
    () => (
      <View style={S.modal}>
        <TouchableOpacity style={S.actionButton}>
          <Text style={S.actionText}>Action 1</Text>
        </TouchableOpacity>
        <View style={S.separator} />
        <TouchableOpacity style={S.actionButton}>
          <Text style={S.actionText}>Action 2</Text>
        </TouchableOpacity>
        <View style={S.separator} />
        <TouchableOpacity style={S.actionButton}>
          <Text style={S.actionText}>Action 3</Text>
        </TouchableOpacity>
      </View>
    ),
    [S.actionButton, S.actionText, S.modal, S.separator],
  );

  return (
    <View style={S.container}>
      <Text style={S.title} children={T.theNewYorkTimesApp} />
      <ActionModal
        visible={actionVisible}
        setVisible={setActionVisible}
        modalComponent={actionModal}>
        <TouchableOpacity style={S.button} onPress={onAction}>
          <MenuBurgerIcon {...S.menuIconProps} />
        </TouchableOpacity>
      </ActionModal>
    </View>
  );
};

export default observer(HomeHeaderActions);
