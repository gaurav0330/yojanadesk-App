import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Tasks() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const role = await AsyncStorage.getItem('userRole');
        
        console.log('Debug Info:', {
          id: id || 'Not found',
          username: username || 'Not found',
          role: role || 'Not found'
        });

        if (!id) {
          console.warn('No user ID found');
          setIsLoading(false);
          return;
        }

        if (role !== 'Team_Member') {
          console.warn('User is not a Team Member');
          setIsLoading(false);
          return;
        }

        setUserData({ id, username: username || 'User', role });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Placeholder tasks data
  const tasks = [
    {
      id: '1',
      title: 'Complete Project Documentation',
      project: 'Project A',
      dueDate: '2024-03-20',
      priority: 'High',
      status: 'In Progress',
    },
    {
      id: '2',
      title: 'Review Code Changes',
      project: 'Project B',
      dueDate: '2024-03-18',
      priority: 'Medium',
      status: 'Pending',
    },
    {
      id: '3',
      title: 'Update Test Cases',
      project: 'Project A',
      dueDate: '2024-03-22',
      priority: 'Low',
      status: 'Completed',
    },
    {
      id: '4',
      title: 'Fix UI Bugs',
      project: 'Project C',
      dueDate: '2024-03-19',
      priority: 'High',
      status: 'Pending',
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  if (!userData?.id) {
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

  const renderTask = ({ item }) => (
    <View className="p-4 mx-4 my-2 bg-white shadow-sm rounded-xl">
      <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
      <Text className="text-sm text-gray-600">Project: {item.project}</Text>
      <Text className="text-sm text-gray-600">Due: {item.dueDate}</Text>
      
      <View className="flex-row items-center justify-between mt-3">
        <View className={`px-3 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
          <Text className="text-xs font-medium text-white">{item.priority}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text className="text-xs font-medium text-white">{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">My Tasks</Text>
        <Text className="text-sm text-gray-600">Welcome, {userData.username}</Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerClassName="py-4"
      />
    </View>
  );
} 