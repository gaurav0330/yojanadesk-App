import { View, Text } from 'react-native'
import React from 'react'
import {Drawer} from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = (props) => {
    return(
    <DrawerContentScrollView {...props}>
      <View className="px-4 py-6 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Team Member Portal</Text>
      </View>
      
      <View className="flex-1 mt-4">
        <DrawerItem 
          label="Dashboard"
          icon={({color, size}) => <Ionicons name="home-outline" size={size} color={color} />}
          onPress={() => router.push('/TeamMember/(drawer)/(tabs)')}
        />
        <DrawerItem 
          label="My Projects"
          icon={({color, size}) => <Ionicons name="folder-outline" size={size} color={color} />}
          onPress={() => router.push('/TeamMember/(drawer)/(tabs)/projects')}
        />
        <DrawerItem 
          label="Tasks"
          icon={({color, size}) => <Ionicons name="list-outline" size={size} color={color} />}
          onPress={() => router.push('/TeamMember/(drawer)/(tabs)/tasks')}
        />
        <DrawerItem 
          label="Settings"
          icon={({color, size}) => <Ionicons name="settings-outline" size={size} color={color} />}
          onPress={() => router.push('/TeamMember/(drawer)/(tabs)/settings')}
        />
      </View>
      
      <View className="border-t border-gray-200 pt-2">
        <DrawerItem 
          label="Logout"
          icon={({color, size}) => <Ionicons name="log-out-outline" size={size} color={color} />}
          onPress={() => router.replace('/login')}
          labelStyle={{ color: '#EF4444' }}
        />
      </View>
    </DrawerContentScrollView>
    );
};

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#374151',
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: 280,
          },
          headerShown: true,
          swipeEnabled: true,
          drawerType: "front"
        }}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{
            title: "Team Member",
            headerShown: true,
            drawerLabel: "Home"
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}