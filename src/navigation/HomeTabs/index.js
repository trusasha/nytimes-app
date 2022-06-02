import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'screens/Home';
import Profile from 'screens/Profile';
import { configStore } from 'stores';

const Tabs = createBottomTabNavigator();
const R = configStore.routeNameLocalization;

export const HomeTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name={R.Home} component={Home} />
      <Tabs.Screen name={R.Profile} component={Profile} />
    </Tabs.Navigator>
  );
};
