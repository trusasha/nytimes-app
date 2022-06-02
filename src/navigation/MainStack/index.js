import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabs } from '../HomeTabs';
import { configStore } from 'stores';
import Login from 'screens/Login';

const Stack = createNativeStackNavigator();
const R = configStore.routeNameLocalization;

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={R.HomeTabs} component={HomeTabs} />
      <Stack.Screen name={R.Login} component={Login} />
    </Stack.Navigator>
  );
};
