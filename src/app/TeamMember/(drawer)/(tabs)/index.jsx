import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Dashboard() {
  const stats = [
    { title: 'Active Projects', count: 5, icon: 'folder', color: '#3B82F6' },
    { title: 'Pending Tasks', count: 12, icon: 'list', color: '#F59E0B' },
    { title: 'Completed Tasks', count: 8, icon: 'checkmark-circle', color: '#10B981' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Dashboard</Text>
      </View>

      <View className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {stats.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm"
              onPress={() => router.push(item.title.toLowerCase().includes('project') ? './projects' : './tasks')}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.count}
                </Text>
              </View>
              <Text className="text-sm text-gray-600">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Recent Projects</Text>
            <TouchableOpacity onPress={() => router.push('./projects')}>
              <Text className="text-sm text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder for recent projects */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-600">Loading recent projects...</Text>
          </View>
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Upcoming Tasks</Text>
            <TouchableOpacity onPress={() => router.push('./tasks')}>
              <Text className="text-sm text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder for upcoming tasks */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-600">Loading upcoming tasks...</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
