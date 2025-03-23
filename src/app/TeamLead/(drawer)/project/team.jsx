import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useProject } from './_layout';

export default function TeamScreen() {
  const { projectId } = useProject();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">Team Members</Text>
          <TouchableOpacity className="bg-blue-500 p-3 rounded-full">
            <MaterialIcons name="person-add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Team List */}
        <View className="space-y-4">
          {/* Team Member Item */}
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                <MaterialIcons name="person" size={24} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">John Doe</Text>
                <Text className="text-sm text-gray-600">Developer</Text>
              </View>
              <TouchableOpacity className="p-2">
                <MaterialIcons name="more-vert" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add more team member items here */}
        </View>
      </ScrollView>
    </View>
  );
} 