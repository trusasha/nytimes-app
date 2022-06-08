import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'screens/Home';
import Profile from 'screens/Profile';
import { configStore } from 'stores';
import { View } from 'react-native';
import HomeHeaderActions from 'screens/Home/HomeHeaderActions';

const Tabs = createBottomTabNavigator();
const R = configStore.routeNameLocalization;

export const HomeTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name={R.Home}
        component={Home}
        options={{
          headerTitleAlign: 'left',
          headerRight: () => <HomeHeaderActions />,
          headerRightContainerStyle: { paddingRight: 12 },
        }}
      />
      <Tabs.Screen name={R.Profile} component={Profile} />
    </Tabs.Navigator>
  );
};
