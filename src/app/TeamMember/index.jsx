import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TeamMemberIndex() {
  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        console.log('Current role:', role);
        
        if (role === 'Team_Member') {
          // Redirect to the drawer navigation
          router.replace('/TeamMember/(drawer)/(tabs)');
        } else {
          console.warn('Not a Team Member, redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking role:', error);
        router.replace('/login');
      }
    };

    checkRole();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-gray-600">Loading Team Member Portal...</Text>
    </View>
  );
} 