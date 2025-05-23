import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>

      <Tabs.Screen name="index" options={{href:null}} />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />

      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />

      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user-md" color={color} />
        }}
      />
    </Tabs>
  );
}
