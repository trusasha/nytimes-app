import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';

const Profile = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile</Text>
    </View>
  );
};

export default observer(Profile);
