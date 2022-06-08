import React, { useState, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';
import ActionModal from 'components/ActionModal';

const HomeHeaderActions = ({}) => {
  const S = useStyles();

  const [visible, setVisible] = useState(false);

  const modalComponent = useMemo(
    () => (
      <View style={S.modal}>
        <Text children={'MODAL'} />
      </View>
    ),
    [S.modal],
  );

  const onOpen = useCallback(() => setVisible(true), []);

  return (
    <ActionModal visible={visible} setVisible={setVisible} modalComponent={modalComponent}>
      <TouchableOpacity style={S.container} onPress={onOpen} activeOpacity={0.8}>
        <Text style={{ fontSize: 24 }} children={'+'} />
      </TouchableOpacity>
    </ActionModal>
  );
};

export default observer(HomeHeaderActions);
