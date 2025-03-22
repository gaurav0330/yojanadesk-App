import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

export default function TeamLeadLayout() {
  const pathname = usePathname();
  const isProjectView = pathname.includes('/project/');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: isProjectView ? 'flex' : 'none',
        },
      }}
    >
      <Tabs.Screen
        name="welcome"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: 'Project Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 