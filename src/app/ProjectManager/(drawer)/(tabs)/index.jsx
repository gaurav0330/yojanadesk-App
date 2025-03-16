import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');
      const role = await AsyncStorage.getItem('userRole');
      const id = await AsyncStorage.getItem('id');
      const email = await AsyncStorage.getItem('email'); // Optional

      if (token && username && role && id) {
        setUserData({ token, username, role, id, email });
      } else {
        // Redirect to login if token is not found
        router.replace('/login');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all stored data
      router.replace('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-4xl font-bold text-blue-600 mb-8">User Dashboard</Text>

      {userData ? (
        <>
          <Text className="text-lg text-gray-800 mb-4">Username: {userData.username}</Text>
          <Text className="text-lg text-gray-800 mb-4">Role: {userData.role}</Text>
          <Text className="text-lg text-gray-800 mb-4">User ID: {userData.id}</Text>
          <Text className="text-lg text-gray-800 mb-6">Email: {userData.email || 'N/A'}</Text>

          <TouchableOpacity
            className="bg-red-500 px-6 py-3 rounded-lg"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text className="text-lg text-gray-500">No user data found</Text>
      )}
    </View>
  );
};

export default Dashboard;
