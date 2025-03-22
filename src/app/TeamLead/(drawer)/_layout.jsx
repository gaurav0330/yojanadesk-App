import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function DrawerLayout() {
  const router = useRouter();

  const handleBackToProjects = () => {
    router.push('/TeamLead/welcome');
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen
        name="project/[id]"
        options={{
          title: 'Project Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackToProjects}
              className="ml-4"
            >
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="submit-task"
        options={{
          title: 'Submit Task',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{
          title: 'Logout',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="logout" size={size} color="#FF3B30" />
          ),
        }}
      />
    </Drawer>
  );
} 