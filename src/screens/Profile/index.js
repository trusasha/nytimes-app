import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import RippleView from 'components/RippleView';

const Profile = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile</Text>
      <RippleView
        style={{
          marginTop: 50,
          width: 300,
          height: 300,
          borderRadius: 24,
          shadowOpacity: 0.5,
          shadowColor: 'black',
          shadowRadius: 10,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text children={'Tap'} />
      </RippleView>
    </View>
  );
};

export default observer(Profile);
