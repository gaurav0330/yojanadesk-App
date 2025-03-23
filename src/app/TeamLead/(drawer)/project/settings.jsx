import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useProject } from './_layout';

export default function SettingsScreen() {
  const { projectId } = useProject();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Project Settings</Text>

        {/* Settings Sections */}
        <View className="space-y-6">
          {/* General Settings */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">General</Text>
            <View className="space-y-4">
              <TouchableOpacity className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="notifications" size={24} color="#3B82F6" />
                  <Text className="text-gray-700 ml-3">Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                  thumbColor={notifications ? '#3B82F6' : '#9CA3AF'}
                />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="dark-mode" size={24} color="#3B82F6" />
                  <Text className="text-gray-700 ml-3">Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                  thumbColor={darkMode ? '#3B82F6' : '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Project Settings */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Project</Text>
            <View className="space-y-4">
              <TouchableOpacity className="flex-row items-center">
                <MaterialIcons name="edit" size={24} color="#3B82F6" />
                <Text className="text-gray-700 ml-3">Edit Project Details</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <MaterialIcons name="delete" size={24} color="#EF4444" />
                <Text className="text-red-600 ml-3">Delete Project</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Team Settings */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Team</Text>
            <View className="space-y-4">
              <TouchableOpacity className="flex-row items-center">
                <MaterialIcons name="group" size={24} color="#3B82F6" />
                <Text className="text-gray-700 ml-3">Manage Team Members</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <MaterialIcons name="security" size={24} color="#3B82F6" />
                <Text className="text-gray-700 ml-3">Permissions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 