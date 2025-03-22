import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import React, { createContext, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';

// Create Project Context
export const ProjectContext = createContext();

// Custom hook to use project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default function ProjectTabLayout() {
  const { id: projectId } = useLocalSearchParams();

  return (
    <ProjectContext.Provider value={{ projectId }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="[id]"
          options={{
            title: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="team"
          options={{
            title: 'Team',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProjectContext.Provider>
  );
} 