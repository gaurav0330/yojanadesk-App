import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center bg-red-500 px-6 py-3 rounded-lg"
      >
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text className="ml-2 text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
} 