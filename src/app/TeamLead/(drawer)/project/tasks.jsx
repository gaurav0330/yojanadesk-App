import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useProject } from './_layout';

export default function TasksScreen() {
  const { projectId } = useProject();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">Tasks</Text>
          <TouchableOpacity className="bg-blue-500 p-3 rounded-full">
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <View className="space-y-4">
          {/* Task Item */}
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">Task Title</Text>
                <Text className="text-sm text-gray-600 mt-1">Task description goes here...</Text>
                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="schedule" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-1">Due: March 25, 2024</Text>
                </View>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-blue-600">In Progress</Text>
              </View>
            </View>
          </View>

          {/* Add more task items here */}
        </View>
      </ScrollView>
    </View>
  );
} 