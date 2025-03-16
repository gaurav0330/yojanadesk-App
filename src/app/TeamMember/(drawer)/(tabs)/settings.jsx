import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const email = await AsyncStorage.getItem('email');
        const role = await AsyncStorage.getItem('userRole');
        
        if (!id) {
          console.warn('No user ID found');
          setIsLoading(false);
          return;
        }

        setUserData({ 
          id, 
          username: username || 'User',
          email: email || 'user@example.com',
          role: role || 'Unknown'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'id', 'username', 'email', 'userRole']);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading settings...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-lg text-center text-red-500 mb-4">
          Unable to load your profile. Please log in again.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.replace('/login')}
        >
          <Text className="text-white font-medium">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="mt-4 mx-4 bg-white rounded-xl overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Profile</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
                <Text className="text-white font-bold">{userData.username.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text className="text-base font-medium text-gray-800">{userData.username}</Text>
                <Text className="text-sm text-gray-600">{userData.email}</Text>
              </View>
            </View>
            
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mt-4 mx-4 bg-white rounded-xl overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Preferences</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={notifications ? "#3B82F6" : "#F3F4F6"}
              />
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={darkMode ? "#3B82F6" : "#F3F4F6"}
              />
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View className="mt-4 mx-4 bg-white rounded-xl overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Support</Text>
          </View>
          
          <View className="p-4">
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <Text className="text-base text-gray-800">Contact Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="m-4">
          <TouchableOpacity
            className="bg-red-500 py-3 rounded-xl items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View className="py-4 items-center">
          <Text className="text-gray-500 text-sm">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;